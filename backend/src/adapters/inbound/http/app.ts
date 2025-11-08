import express from "express";
import type { RoutesRepository } from "../../../core/ports/RoutesPort";
import { ComputeComparison } from "../../../core/application/ComputeComparison";
import type { BankingRepository, ComplianceRepository, RoutesReadRepository } from "../../../core/ports/CompliancePort";
import { ComputeCB } from "../../../core/application/ComputeCB";
import { BankSurplus } from "../../../core/application/BankSurplus";
import { ApplyBanked } from "../../../core/application/ApplyBanked";
import { CreatePoolUseCase } from "../../../core/application/CreatePool";

export function createApp(deps: {
  routesRepo: RoutesRepository;
  routesReadRepo: RoutesReadRepository;
  complianceRepo: ComplianceRepository;
  bankingRepo: BankingRepository;
}) {
  const app = express();
  app.use(express.json());

  // Routes
  app.get("/routes", async (_req, res, next) => {
    try {
      const routes = await deps.routesRepo.getAll();
      res.json(routes);
    } catch (e) { next(e); }
  });

  app.post("/routes/:id/baseline", async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      await deps.routesRepo.setBaseline(id);
      res.status(204).end();
    } catch (e) { next(e); }
  });

  app.get("/routes/comparison", async (_req, res, next) => {
    try {
      const usecase = new ComputeComparison(deps.routesRepo);
      const rows = await usecase.exec();
      res.json(rows);
    } catch (e) { next(e); }
  });

  // Compliance
  app.get("/compliance/cb", async (req, res, next) => {
    try {
      const shipId = String(req.query.shipId || req.query.routeId);
      const year = Number(req.query.year);
      const usecase = new ComputeCB(deps.routesReadRepo, deps.complianceRepo);
      const result = await usecase.exec({ shipId, year });
      res.json({ shipId, year, cb: result.cb });
    } catch (e) { next(e); }
  });

  app.get("/compliance/adjusted-cb", async (req, res, next) => {
    try {
      const shipId = String(req.query.shipId || req.query.routeId);
      const year = Number(req.query.year);
      const snapshot = await deps.complianceRepo.getSnapshot(shipId, year);
      if (!snapshot) return res.status(404).json({ error: "No compliance snapshot" });
      const entries = await deps.bankingRepo.getEntries(shipId, year);
      const appliedTotal = entries.filter(e => e.amount < 0).reduce((s, e) => s + e.amount, 0);
      const adjusted = snapshot.cb + appliedTotal; // applied entries are negative
      res.json({ shipId, year, cb: snapshot.cb, adjustedCB: adjusted });
    } catch (e) { next(e); }
  });

  // Banking
  app.get("/banking/records", async (req, res, next) => {
    try {
      const shipId = String(req.query.shipId || req.query.routeId);
      const year = Number(req.query.year);
      const records = await deps.bankingRepo.getEntries(shipId, year);
      res.json(records);
    } catch (e) { next(e); }
  });

  app.post("/banking/bank", async (req, res, next) => {
    try {
      const { shipId, year } = req.body as { shipId: string; year: number };
      const usecase = new BankSurplus(deps.complianceRepo, deps.bankingRepo);
      const result = await usecase.exec({ shipId, year });
      res.json(result);
    } catch (e) { next(e); }
  });

  app.post("/banking/apply", async (req, res, next) => {
    try {
      const { shipId, year, amount } = req.body as { shipId: string; year: number; amount: number };
      const usecase = new ApplyBanked(deps.complianceRepo, deps.bankingRepo);
      const result = await usecase.exec({ shipId, year, amount });
      res.json(result);
    } catch (e) { next(e); }
  });

  // Pools
  app.post("/pools", async (req, res, next) => {
    try {
      const members = req.body?.members as { shipId: string; year: number }[];
      if (!Array.isArray(members)) return res.status(400).json({ error: "members required" });
      // load CBs from snapshots; require they exist
      const withCb: { shipId: string; year: number; cb: number }[] = [];
      for (const m of members) {
        const snap = await deps.complianceRepo.getSnapshot(m.shipId, m.year);
        if (!snap) return res.status(400).json({ error: `No CB snapshot for ${m.shipId}-${m.year}` });
        withCb.push({ shipId: m.shipId, year: m.year, cb: snap.cb });
      }
      const usecase = new CreatePoolUseCase();
      const result = usecase.exec(withCb);
      res.json({ members: result, poolSum: result.reduce((s, r) => s + r.cb_after, 0) });
    } catch (e) { next(e); }
  });

  app.use((err: any, _req: any, res: any, _next: any) => {
    const msg = err?.message || "Internal error";
    res.status(400).json({ error: msg });
  });

  return app;
}


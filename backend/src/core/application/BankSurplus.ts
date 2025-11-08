import type { BankingRepository, ComplianceRepository } from "../ports/CompliancePort";

export class BankSurplus {
  constructor(
    private readonly complianceRepo: ComplianceRepository,
    private readonly bankingRepo: BankingRepository
  ) {}

  async exec(params: { shipId: string; year: number }) {
    const { shipId, year } = params;
    const snapshot = await this.complianceRepo.getSnapshot(shipId, year);
    if (!snapshot) throw new Error("No compliance snapshot. Compute CB first.");
    if (snapshot.cb <= 0) throw new Error("CB is non-positive. Nothing to bank.");
    const entry = await this.bankingRepo.addEntry(shipId, year, snapshot.cb);
    return { cb_before: snapshot.cb, applied: snapshot.cb, cb_after: 0, entry };
  }
}


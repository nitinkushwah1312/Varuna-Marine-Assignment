import type { ComplianceSnapshot, BankingEntry } from "../domain/Compliance";
import type { Route } from "../domain/Route";

export interface ComplianceRepository {
  upsertSnapshot(shipId: string, year: number, cb: number): Promise<ComplianceSnapshot>;
  getSnapshot(shipId: string, year: number): Promise<ComplianceSnapshot | null>;
}

export interface BankingRepository {
  getEntries(shipId: string, year: number): Promise<BankingEntry[]>;
  addEntry(shipId: string, year: number, amount: number): Promise<BankingEntry>;
}

export interface RoutesReadRepository {
  findByShipAndYear(shipId: string, year: number): Promise<Route | null>;
}


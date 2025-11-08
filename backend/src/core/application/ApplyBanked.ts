import type { BankingRepository, ComplianceRepository } from "../ports/CompliancePort";

export class ApplyBanked {
  constructor(
    private readonly complianceRepo: ComplianceRepository,
    private readonly bankingRepo: BankingRepository
  ) {}

  async exec(params: { shipId: string; year: number; amount: number }) {
    const { shipId, year, amount } = params;
    const snapshot = await this.complianceRepo.getSnapshot(shipId, year);
    if (!snapshot) throw new Error("No compliance snapshot. Compute CB first.");

    // Aggregate available banked surplus from current and previous years (lookback window)
    const LOOKBACK_YEARS = 5;
    let available = 0;
    for (let y = year; y >= year - LOOKBACK_YEARS; y--) {
      const list = await this.bankingRepo.getEntries(shipId, y);
      available += list.reduce((sum, e) => sum + e.amount, 0);
    }
    if (available <= 0) throw new Error("No available banked surplus.");
    if (amount > available) throw new Error("Requested amount exceeds available banked surplus.");

    const cb_before = snapshot.cb;
    if (cb_before >= 0) throw new Error("No deficit to apply against.");

    const applied = Math.min(amount, -cb_before);
    await this.bankingRepo.addEntry(shipId, year, -applied);
    const cb_after = cb_before + applied;
    return { cb_before, applied, cb_after };
  }
}

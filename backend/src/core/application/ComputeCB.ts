import { ENERGY_PER_TON_MJ, TARGET_INTENSITY_2025 } from "../../shared/constants";
import type { ComplianceRepository, RoutesReadRepository } from "../ports/CompliancePort";

export class ComputeCB {
  constructor(
    private readonly routesRepo: RoutesReadRepository,
    private readonly complianceRepo: ComplianceRepository
  ) {}

  async exec(params: { shipId: string; year: number }) {
    const { shipId, year } = params;
    const route = await this.routesRepo.findByShipAndYear(shipId, year);
    if (!route) throw new Error("Route/ship not found for year");

    const energy = route.fuelConsumption * ENERGY_PER_TON_MJ;
    const cb = (TARGET_INTENSITY_2025 - route.ghgIntensity) * energy;
    const snapshot = await this.complianceRepo.upsertSnapshot(shipId, year, cb);
    return { cb, snapshot };
  }
}


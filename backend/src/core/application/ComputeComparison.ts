import type { RoutesRepository } from "../ports/RoutesPort";
import type { ComparisonRow } from "../domain/Route";
import { TARGET_INTENSITY_2025 } from "../../shared/constants";

export class ComputeComparison {
  constructor(private readonly routesRepo: RoutesRepository) {}

  async exec(): Promise<ComparisonRow[]> {
    const routes = await this.routesRepo.getAll();
    const baseline = routes.find((r) => r.isBaseline);
    if (!baseline) return [];

    const baselineGhg = baseline.ghgIntensity;
    return routes
      .filter((r) => r.id !== baseline.id)
      .map((r) => {
        const percentDiff = ((r.ghgIntensity / baselineGhg) - 1) * 100;
        const compliant = r.ghgIntensity <= TARGET_INTENSITY_2025;
        return {
          routeId: r.routeId,
          baselineGhg,
          comparisonGhg: r.ghgIntensity,
          percentDiff,
          compliant,
        } as ComparisonRow;
      });
  }
}


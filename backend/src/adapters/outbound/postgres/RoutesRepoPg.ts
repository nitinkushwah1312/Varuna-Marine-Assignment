import type { Route } from "../../../core/domain/Route";
import type { RoutesRepository } from "../../../core/ports/RoutesPort";
import type { Pool } from "pg";

export class RoutesRepoPg implements RoutesRepository {
  constructor(private readonly pool: Pool) {}

  async getAll(): Promise<Route[]> {
    const { rows } = await this.pool.query(
      `select id, route_id as "routeId", vessel_type as "vesselType", fuel_type as "fuelType", year,
              ghg_intensity as "ghgIntensity", fuel_consumption as "fuelConsumption", distance, total_emissions as "totalEmissions",
              is_baseline as "isBaseline"
       from routes order by id`
    );
    return rows as Route[];
  }

  async setBaseline(id: number): Promise<void> {
    await this.pool.query("update routes set is_baseline = false");
    await this.pool.query("update routes set is_baseline = true where id = $1", [id]);
  }

  async getBaseline(): Promise<Route | null> {
    const { rows } = await this.pool.query(
      `select id, route_id as "routeId", vessel_type as "vesselType", fuel_type as "fuelType", year,
              ghg_intensity as "ghgIntensity", fuel_consumption as "fuelConsumption", distance, total_emissions as "totalEmissions",
              is_baseline as "isBaseline"
       from routes where is_baseline = true limit 1`
    );
    return rows[0] ?? null;
  }
}


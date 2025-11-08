import type { Pool } from "pg";
import type { ComplianceRepository, BankingRepository, RoutesReadRepository } from "../../../core/ports/CompliancePort";
import type { ComplianceSnapshot, BankingEntry } from "../../../core/domain/Compliance";
import type { Route } from "../../../core/domain/Route";

export class ComplianceRepoPg implements ComplianceRepository {
  constructor(private readonly pool: Pool) {}

  async upsertSnapshot(shipId: string, year: number, cb: number): Promise<ComplianceSnapshot> {
    const { rows } = await this.pool.query(
      `insert into ship_compliance (ship_id, year, cb_gco2eq)
       values ($1, $2, $3)
       on conflict (ship_id, year)
       do update set cb_gco2eq = excluded.cb_gco2eq
       returning id, ship_id as "shipId", year, cb_gco2eq as cb`,
      [shipId, year, cb]
    );
    return rows[0];
  }

  async getSnapshot(shipId: string, year: number): Promise<ComplianceSnapshot | null> {
    const { rows } = await this.pool.query(
      `select id, ship_id as "shipId", year, cb_gco2eq as cb from ship_compliance where ship_id=$1 and year=$2`,
      [shipId, year]
    );
    return rows[0] ?? null;
  }
}

export class BankingRepoPg implements BankingRepository {
  constructor(private readonly pool: Pool) {}

  async getEntries(shipId: string, year: number): Promise<BankingEntry[]> {
    const { rows } = await this.pool.query(
      `select id, ship_id as "shipId", year, amount_gco2eq as amount, created_at as "createdAt"
       from bank_entries where ship_id=$1 and year=$2 order by created_at asc`,
      [shipId, year]
    );
    return rows;
  }

  async addEntry(shipId: string, year: number, amount: number): Promise<BankingEntry> {
    const { rows } = await this.pool.query(
      `insert into bank_entries (ship_id, year, amount_gco2eq) values ($1, $2, $3)
       returning id, ship_id as "shipId", year, amount_gco2eq as amount, created_at as "createdAt"`,
      [shipId, year, amount]
    );
    return rows[0];
  }
}

export class RoutesReadRepoPg implements RoutesReadRepository {
  constructor(private readonly pool: Pool) {}
  async findByShipAndYear(shipId: string, year: number): Promise<Route | null> {
    const { rows } = await this.pool.query(
      `select id, route_id as "routeId", vessel_type as "vesselType", fuel_type as "fuelType", year,
              ghg_intensity as "ghgIntensity", fuel_consumption as "fuelConsumption", distance, total_emissions as "totalEmissions",
              is_baseline as "isBaseline"
       from routes where route_id=$1 and year=$2 limit 1`,
      [shipId, year]
    );
    return rows[0] ?? null;
  }
}


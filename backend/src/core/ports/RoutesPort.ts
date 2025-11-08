import type { Route, ComparisonRow } from "../domain/Route";

export interface RoutesRepository {
  getAll(): Promise<Route[]>;
  setBaseline(id: number): Promise<void>;
  getBaseline(): Promise<Route | null>;
}

export interface ComparisonService {
  computeComparison(): Promise<ComparisonRow[]>;
}


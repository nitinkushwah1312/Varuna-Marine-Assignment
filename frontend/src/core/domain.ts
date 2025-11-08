export type Route = {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
};

export type ComparisonRow = {
  routeId: string;
  baselineGhg: number;
  comparisonGhg: number;
  percentDiff: number;
  compliant: boolean;
};


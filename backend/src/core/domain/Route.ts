export type Route = {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number; // gCO2e/MJ
  fuelConsumption: number; // tons
  distance: number; // km
  totalEmissions: number; // tons
  isBaseline: boolean;
};

export type ComparisonRow = {
  routeId: string;
  baselineGhg: number;
  comparisonGhg: number;
  percentDiff: number;
  compliant: boolean;
};


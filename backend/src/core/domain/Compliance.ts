export type ComplianceSnapshot = {
  id: number;
  shipId: string;
  year: number;
  cb: number; // gCO2e equivalent
};

export type BankingEntry = {
  id: number;
  shipId: string;
  year: number;
  amount: number; // positive for banked, negative for applied
  createdAt: Date;
};


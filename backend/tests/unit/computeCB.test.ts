import { describe, it, expect } from 'vitest';
import { ComputeCB } from '../../src/core/application/ComputeCB';

class InMemRoutesRead {
  constructor(private r: any) {}
  async findByShipAndYear(id: string, year: number) { return this.r[id+year] ?? null; }
}
class InMemComplianceRepo {
  snap: any = {};
  async upsertSnapshot(shipId: string, year: number, cb: number) { this.snap[shipId+year] = { id:1, shipId, year, cb }; return this.snap[shipId+year]; }
  async getSnapshot(shipId: string, year: number) { return this.snap[shipId+year] ?? null; }
}

describe('ComputeCB', () => {
  it('computes CB using target and energy', async () => {
    const route = { id:1, routeId:'R001', vesselType:'Container', fuelType:'HFO', year:2024, ghgIntensity:91, fuelConsumption:5000, distance:0, totalEmissions:0, isBaseline:false };
    const usecase = new ComputeCB(new InMemRoutesRead({['R0012024']: route}) as any, new InMemComplianceRepo() as any);
    const { cb } = await usecase.exec({ shipId:'R001', year:2024 });
    // TARGET 89.3368, actual 91 => negative
    expect(cb).toBeLessThan(0);
  });
});


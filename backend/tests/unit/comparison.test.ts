import { describe, it, expect } from 'vitest';
import { ComputeComparison } from '../../src/core/application/ComputeComparison';

class InMemRoutesRepo {
  constructor(private routes: any[]) {}
  async getAll() { return this.routes; }
  async setBaseline(_id: number) {}
  async getBaseline() { return this.routes.find(r => r.isBaseline) ?? null; }
}

describe('ComputeComparison', () => {
  it('creates comparison rows with percent diff and compliant flag', async () => {
    const routes = [
      { id:1, routeId:'R001', ghgIntensity:90, isBaseline:true },
      { id:2, routeId:'R002', ghgIntensity:100, isBaseline:false },
    ];
    const rows = await new ComputeComparison(new InMemRoutesRepo(routes) as any).exec();
    expect(rows).toHaveLength(1);
    expect(rows[0].routeId).toBe('R002');
    expect(typeof rows[0].percentDiff).toBe('number');
  });
});


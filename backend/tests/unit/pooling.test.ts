import { describe, it, expect } from 'vitest';
import { CreatePoolUseCase } from '../../src/core/application/CreatePool';

describe('Pooling', () => {
  it('balances surplus to deficits greedily', () => {
    const res = new CreatePoolUseCase().exec([
      { shipId:'A', year:2024, cb: 100 },
      { shipId:'B', year:2024, cb: -60 },
      { shipId:'C', year:2024, cb: -40 },
    ]);
    const m = Object.fromEntries(res.map(r => [r.shipId, r.cb_after]));
    expect(m['A']).toBe(0);
    expect(m['B']).toBe(0);
    expect(m['C']).toBe(0);
  });
});


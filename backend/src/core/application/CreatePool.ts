type Member = { shipId: string; year: number; cb: number };

export class CreatePoolUseCase {
  // Greedy allocation in-memory; persistence is adapter concern
  exec(members: Member[]) {
    const sum = members.reduce((s, m) => s + m.cb, 0);
    if (sum < 0) throw new Error("Pool sum must be non-negative");

    const sorted = [...members].sort((a, b) => b.cb - a.cb);
    const after: Record<string, number> = Object.fromEntries(members.map(m => [m.shipId, m.cb]));

    let i = 0;
    let j = sorted.length - 1;
    while (i < j) {
      const surplus = Math.max(0, after[sorted[i].shipId]);
      const deficit = Math.min(0, after[sorted[j].shipId]);
      if (surplus <= 0) { i++; continue; }
      if (deficit >= 0) { j--; continue; }
      const transfer = Math.min(surplus, -deficit);
      after[sorted[i].shipId] -= transfer; // surplus cannot go negative
      after[sorted[j].shipId] += transfer; // deficit cannot get worse than before
      if (after[sorted[i].shipId] === 0) i++;
      if (after[sorted[j].shipId] >= 0) j--;
    }

    // Validate constraints
    for (const m of members) {
      if (m.cb < 0 && after[m.shipId] < m.cb) {
        throw new Error("Deficit ship exited worse than before");
      }
      if (m.cb > 0 && after[m.shipId] < 0) {
        throw new Error("Surplus ship exited negative");
      }
    }

    return members.map(m => ({ shipId: m.shipId, year: m.year, cb_before: m.cb, cb_after: after[m.shipId] }));
  }
}


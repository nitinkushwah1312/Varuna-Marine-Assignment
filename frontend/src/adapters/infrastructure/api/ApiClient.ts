const base: string = (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE) || '';

async function fetchJson(path: string, init?: RequestInit) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 12000);
  try {
    const r = await fetch(`${base}${path}`, { ...init, signal: controller.signal });
    if (!r.ok) {
      let msg = `${r.status} ${r.statusText}`;
      try { const body = await r.json(); if (body?.error) msg = body.error; } catch {}
      throw new Error(msg);
    }
    const ct = r.headers.get('content-type') || '';
    return ct.includes('application/json') ? r.json() : r.text();
  } catch (e: any) {
    if (e?.name === 'AbortError') throw new Error('Request timed out');
    throw new Error(e?.message || 'Network error');
  } finally {
    clearTimeout(id);
  }
}

export const api = {
  getRoutes: () => fetchJson('/routes'),
  setBaseline: (id: number) => fetchJson(`/routes/${id}/baseline`, { method: 'POST' }),
  getComparison: () => fetchJson('/routes/comparison'),
  getCB: (shipId: string, year: number) => fetchJson(`/compliance/cb?shipId=${encodeURIComponent(shipId)}&year=${year}`),
  getAdjustedCB: (shipId: string, year: number) => fetchJson(`/compliance/adjusted-cb?shipId=${encodeURIComponent(shipId)}&year=${year}`),
  bank: (shipId: string, year: number) => fetchJson('/banking/bank', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ shipId, year })}),
  applyBank: (shipId: string, year: number, amount: number) => fetchJson('/banking/apply', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ shipId, year, amount })}),
  createPool: (members: { shipId: string; year: number }[]) => fetchJson('/pools', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ members })}),
}

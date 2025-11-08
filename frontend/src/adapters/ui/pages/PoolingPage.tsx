import { useState } from 'react'
import { api } from '../../infrastructure/api/ApiClient'

type Member = { shipId: string; year: number; cb?: number }

export function PoolingPage() {
  const [members, setMembers] = useState<Member[]>([{ shipId:'R001', year:2024 }, { shipId:'R002', year:2024 }])
  const [result, setResult] = useState<any|null>(null)
  const [err, setErr] = useState<string>('')

  function update(i: number, patch: Partial<Member>) {
    setMembers(m => m.map((x, idx) => idx===i ? { ...x, ...patch } : x))
  }

  async function loadCBs() {
    setErr('');
    const next: Member[] = []
    for (const m of members) {
      try { const r = await api.getCB(m.shipId, m.year); next.push({ ...m, cb: r.cb }) } catch (e:any) { setErr(e.message); return }
    }
    setMembers(next)
  }

  async function createPool() {
    setErr(''); setResult(null)
    try { const r = await api.createPool(members.map(({ shipId, year }) => ({ shipId, year }))); setResult(r) } catch (e:any) { setErr(e.message) }
  }

  const sum = members.reduce((s, m) => s + (m.cb ?? 0), 0)
  const valid = sum >= 0

  return (
    <div className="space-y-4">
      <div className="flex gap-2 items-end">
        <button onClick={() => setMembers(m => [...m, { shipId:'', year:2024 }])}>Add Member</button>
        <button onClick={loadCBs}>Load CBs</button>
        <div className={"px-3 py-2 rounded " + (valid?"bg-green-100 text-green-700":"bg-red-100 text-red-700")}>Pool Sum: {sum.toFixed(2)}</div>
        <button disabled={!valid} onClick={createPool}>Create Pool</button>
      </div>
      <table>
        <thead>
          <tr><th>ShipId</th><th>Year</th><th>CB</th><th></th></tr>
        </thead>
        <tbody>
          {members.map((m,i) => (
            <tr key={i}>
              <td><input value={m.shipId} onChange={e=>update(i,{ shipId:e.target.value })} /></td>
              <td><input type="number" value={m.year} onChange={e=>update(i,{ year:Number(e.target.value) })} /></td>
              <td>{m.cb===undefined?'-':m.cb.toFixed(2)}</td>
              <td><button onClick={()=>setMembers(x=>x.filter((_,j)=>j!==i))}>Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {result && (
        <div className="space-y-2">
          <div className="font-medium">Pool Result</div>
          <table>
            <thead>
              <tr><th>ShipId</th><th>CB Before</th><th>CB After</th></tr>
            </thead>
            <tbody>
              {result.members.map((m:any) => (
                <tr key={m.shipId}><td>{m.shipId}</td><td>{m.cb_before.toFixed(2)}</td><td>{m.cb_after.toFixed(2)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {err && <div className="text-red-700">{err}</div>}
    </div>
  )
}


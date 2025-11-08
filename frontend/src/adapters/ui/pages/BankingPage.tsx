import { useState } from 'react'
import { api } from '../../infrastructure/api/ApiClient'

export function BankingPage() {
  const [shipId, setShipId] = useState('R001')
  const [year, setYear] = useState(2024)
  const [cb, setCb] = useState<number|null>(null)
  const [adjusted, setAdjusted] = useState<number|null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [msg, setMsg] = useState<string>('')
  const [err, setErr] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [posting, setPosting] = useState<'bank'|'apply'|null>(null)

  async function load() {
    setErr(''); setMsg(''); setLoading(true)
    try { const r = await api.getCB(shipId, year); setCb(r.cb) } catch(e:any){ setErr(`Load CB failed: ${e.message}`) }
    try { const a = await api.getAdjustedCB(shipId, year); setAdjusted(a.adjustedCB) } catch(e:any){ setErr(prev => prev || `Adjusted CB failed: ${e.message}`) }
    finally { setLoading(false) }
  }

  async function bank() {
    setErr(''); setMsg(''); setPosting('bank')
    try { const r = await api.bank(shipId, year); setMsg(`Banked: ${Number(r.applied).toFixed(2)}`); await load() } catch(e:any){ setErr(`Bank failed: ${e.message}`) } finally { setPosting(null) }
  }

  async function apply() {
    setErr(''); setMsg(''); setPosting('apply')
    try { const r = await api.applyBank(shipId, year, amount); setMsg(`Applied: ${Number(r.applied).toFixed(2)}`); await load() } catch(e:any){ setErr(`Apply failed: ${e.message}`) } finally { setPosting(null) }
  }

  const disableBank = cb===null || cb<=0 || loading || posting!==null
  const disableApply = adjusted===null || adjusted>=0 || loading || posting!==null

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-xs">Ship/Route ID</label>
          <input value={shipId} onChange={e=>setShipId(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs">Year</label>
          <input type="number" value={year} onChange={e=>setYear(Number(e.target.value))} />
        </div>
        <button className="btn-secondary" onClick={load} disabled={loading}>{loading?'Loading…':'Load CB'}</button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-white rounded border">CB: {cb===null?'-':cb.toFixed(2)}</div>
        <div className="p-3 bg-white rounded border">Adjusted CB: {adjusted===null?'-':adjusted.toFixed(2)}</div>
        <div className="p-3 bg-white rounded border">Target: 89.3368 gCO₂e/MJ</div>
      </div>
      <div className="flex flex-wrap gap-2 items-end">
        <button disabled={disableBank} onClick={bank}>{posting==='bank'?'Banking…':'Bank Surplus'}</button>
        <div>
          <label className="block text-xs">Apply Amount</label>
          <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} />
        </div>
        <button className="btn-secondary" disabled={disableApply} onClick={apply}>{posting==='apply'?'Applying…':'Apply Banked'}</button>
      </div>
      {msg && <div className="text-green-700">{msg}</div>}
      {err && <div className="text-red-700">{err}</div>}
    </div>
  )
}

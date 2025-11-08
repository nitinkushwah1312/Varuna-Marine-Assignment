import { useEffect, useMemo, useState } from 'react'
import type { Route } from '../../../core/domain'
import { api } from '../../infrastructure/api/ApiClient'

export function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [filters, setFilters] = useState({ vesselType:'', fuelType:'', year:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string|null>(null)
  const [savingId, setSavingId] = useState<number|null>(null)

  async function load() {
    setLoading(true); setError(null)
    try {
      const data = await api.getRoutes();
      setRoutes(data)
    } catch (e:any) {
      setError(`Failed to fetch routes: ${e.message}. Ensure backend is running.`)
    } finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const vesselTypes = useMemo(() => Array.from(new Set(routes.map(r=>r.vesselType))), [routes])
  const fuelTypes = useMemo(() => Array.from(new Set(routes.map(r=>r.fuelType))), [routes])
  const years = useMemo(() => Array.from(new Set(routes.map(r=>r.year))), [routes])

  const filtered = routes.filter(r => (!filters.vesselType || r.vesselType===filters.vesselType) && (!filters.fuelType || r.fuelType===filters.fuelType) && (!filters.year || r.year===Number(filters.year)))

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs">Vessel Type</label>
          <select value={filters.vesselType} onChange={e=>setFilters(f=>({...f, vesselType:e.target.value}))}>
            <option value="">All</option>
            {vesselTypes.map(v=> <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs">Fuel Type</label>
          <select value={filters.fuelType} onChange={e=>setFilters(f=>({...f, fuelType:e.target.value}))}>
            <option value="">All</option>
            {fuelTypes.map(v=> <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs">Year</label>
          <select value={filters.year} onChange={e=>setFilters(f=>({...f, year:e.target.value}))}>
            <option value="">All</option>
            {years.map(v=> <option key={v} value={String(v)}>{v}</option>)}
          </select>
        </div>
        <button className="btn-secondary" onClick={load} disabled={loading}>{loading? 'Loading…' : 'Reload'}</button>
        {(filters.vesselType || filters.fuelType || filters.year) && (
          <button className="btn-secondary" onClick={()=>setFilters({ vesselType:'', fuelType:'', year:'' })}>Clear</button>
        )}
      </div>
      {error && <div className="text-red-600">{error}</div>}
      {loading ? <div className="text-sm text-gray-600">Loading routes…</div> : (
        <table>
          <thead>
            <tr>
              <th>Baseline</th>
              <th>Route ID</th>
              <th>Vessel</th>
              <th>Fuel</th>
              <th>Year</th>
              <th>GHG Intensity</th>
              <th>Fuel (t)</th>
              <th>Distance (km)</th>
              <th>Emissions (t)</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length===0 && (
              <tr><td colSpan={10} className="text-gray-500 py-6">No routes found</td></tr>
            )}
            {filtered.map(r => (
              <tr key={r.id}>
                <td>{r.isBaseline ? '⭐' : ''}</td>
                <td>{r.routeId}</td>
                <td>{r.vesselType}</td>
                <td>{r.fuelType}</td>
                <td>{r.year}</td>
                <td>{r.ghgIntensity.toFixed(3)}</td>
                <td>{r.fuelConsumption}</td>
                <td>{r.distance}</td>
                <td>{r.totalEmissions}</td>
                <td>
                  <button
                    disabled={r.isBaseline || savingId===r.id}
                    onClick={async ()=>{
                      try { setSavingId(r.id); await api.setBaseline(r.id); await load(); }
                      catch(e:any){ setError(`Set baseline failed: ${e.message}`) }
                      finally { setSavingId(null) }
                    }}
                  >
                    {r.isBaseline ? 'Current' : savingId===r.id ? 'Saving…' : 'Set Baseline'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

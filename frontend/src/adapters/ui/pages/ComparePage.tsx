import { useEffect, useState } from 'react'
import type { ComparisonRow } from '../../../core/domain'
import { api } from '../../infrastructure/api/ApiClient'

export function ComparePage() {
  const [rows, setRows] = useState<ComparisonRow[]>([])
  const [error, setError] = useState<string|null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { (async()=>{
    setLoading(true); setError(null)
    try { setRows(await api.getComparison()) } catch(e:any){ setError(`Failed to fetch comparison: ${e.message}`) } finally { setLoading(false) }
  })() }, [])

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600">{error}</div>}
      {loading && <div className="text-sm text-gray-600">Loading comparison…</div>}
      <table>
        <thead>
          <tr>
            <th>routeId</th>
            <th>baseline ghg</th>
            <th>comparison ghg</th>
            <th>% diff</th>
            <th>compliant</th>
          </tr>
        </thead>
        <tbody>
          {rows.length===0 && !loading && (
            <tr><td colSpan={5} className="text-gray-500 py-6">No comparison available (set a baseline and reload).</td></tr>
          )}
          {rows.map(r => (
            <tr key={r.routeId}>
              <td>{r.routeId}</td>
              <td>{r.baselineGhg.toFixed(3)}</td>
              <td>{r.comparisonGhg.toFixed(3)}</td>
              <td>{r.percentDiff.toFixed(2)}%</td>
              <td>{r.compliant ? '✅' : '❌'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SimpleBarChart data={rows} />
    </div>
  )
}

function SimpleBarChart({ data }: { data: ComparisonRow[] }) {
  const width = 600
  const height = 200
  const max = Math.max(1, ...data.map(d => Math.max(d.baselineGhg, d.comparisonGhg)))
  const barW = Math.max(10, Math.floor(width / Math.max(1, data.length*2)))
  return (
    <svg width={width} height={height} className="bg-white border border-gray-200 rounded">
      {data.map((d, i) => {
        const x = i * barW * 2 + 20
        const h1 = (d.baselineGhg / max) * (height - 20)
        const h2 = (d.comparisonGhg / max) * (height - 20)
        return (
          <g key={d.routeId}>
            <rect x={x} y={height - h1 - 10} width={barW} height={h1} fill="#3b82f6" />
            <rect x={x + barW + 4} y={height - h2 - 10} width={barW} height={h2} fill="#22c55e" />
            <text x={x} y={height - 2} fontSize={10}>{d.routeId}</text>
          </g>
        )
      })}
    </svg>
  )
}

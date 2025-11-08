import { ReactNode, useEffect, useState } from 'react'

export function Tabs(props: { tabs: { key: string; label: string; content: ReactNode }[] }) {
  const { tabs } = props
  const initial = typeof window !== 'undefined' ? window.location.hash.replace('#','') : ''
  const [active, setActive] = useState<string>(tabs.find(t => t.key === initial)?.key || tabs[0].key)

  // keep state in sync with hash changes (e.g., back/forward, manual edits)
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace('#','')
      if (tabs.find(t => t.key === h)) setActive(h)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [tabs])

  const go = (k: string) => {
    setActive(k)
    if (typeof window !== 'undefined') window.location.hash = k
  }
  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => go(t.key)}
            aria-current={t.key===active}
            className={
              "px-4 py-2 rounded-md border transition-colors shadow-sm focus:outline-none focus-visible:ring-2 " +
              (t.key===active
                ? "bg-indigo-600 text-white border-indigo-700 focus-visible:ring-indigo-500/50"
                : "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50 focus-visible:ring-indigo-500/30")
            }
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow">
        {tabs.find(t => t.key===active)?.content}
      </div>
    </div>
  )
}

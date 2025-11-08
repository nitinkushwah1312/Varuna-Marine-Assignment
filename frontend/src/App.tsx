import { Tabs } from './adapters/ui/components/Tabs'
import { RoutesPage } from './adapters/ui/pages/RoutesPage'
import { ComparePage } from './adapters/ui/pages/ComparePage'
import { BankingPage } from './adapters/ui/pages/BankingPage'
import { PoolingPage } from './adapters/ui/pages/PoolingPage'

export function App() {
  return (
    <>
      <header className="bg-indigo-700 text-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Fuel EU Compliance Dashboard</h1>
          <p className="text-indigo-100 mt-1">FuelEU Maritime compliance insights</p>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <Tabs tabs={[
          { key:'routes', label:'Routes', content:<RoutesPage/> },
          { key:'compare', label:'Compare', content:<ComparePage/> },
          { key:'banking', label:'Banking', content:<BankingPage/> },
          { key:'pooling', label:'Pooling', content:<PoolingPage/> },
        ]} />
      </main>
    </>
  )
}

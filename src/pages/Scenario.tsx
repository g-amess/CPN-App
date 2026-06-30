import { Navigate, useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { scenarioById, scenarioSims } from '../content/scenarios'
import { ScenarioSim } from '../components/ScenarioSim'

export function ScenarioPage() {
  const { scenarioId = '' } = useParams()
  const sim = scenarioById(scenarioId)
  if (!sim) return <Navigate to="/exam" replace />

  const idx = scenarioSims.findIndex((s) => s.id === scenarioId)
  const prev = idx > 0 ? scenarioSims[idx - 1] : undefined
  const next = idx < scenarioSims.length - 1 ? scenarioSims[idx + 1] : undefined

  return (
    <div className="animate-fade-in max-w-3xl">
      <ScenarioSim key={sim.id} sim={sim} />

      <nav className="mt-8 flex items-center justify-between gap-3 border-t border-stone-200 pt-5 dark:border-stone-800">
        {prev ? (
          <Link to={`/exam/scenario/${prev.id}`} className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-accent-600 dark:text-stone-300">
            <ChevronLeft size={16} /> {prev.title}
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/exam/scenario/${next.id}`} className="flex items-center gap-1.5 text-sm font-medium text-ink-soft hover:text-accent-600 dark:text-stone-300">
            {next.title} <ChevronRight size={16} />
          </Link>
        ) : <span />}
      </nav>
    </div>
  )
}

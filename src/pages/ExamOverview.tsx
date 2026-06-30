import { Link } from 'react-router-dom'
import { domains, examMeta, examScenarios } from '../content/examTrack'

export function ExamOverview() {
  return (
    <div className="animate-fade-in max-w-4xl">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">Exam Track</p>
      <h1 className="mt-1 text-3xl font-bold">{examMeta.title}</h1>
      <p className="mt-2 max-w-reading text-ink-soft dark:text-stone-300">
        Validates practical judgment about architecture, configuration, and tradeoffs when building production
        applications with Claude Code, the Claude Agent SDK, the Claude API, and MCP.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-sm font-semibold">Format</h2>
          <p className="mt-1 text-sm text-ink-soft dark:text-stone-300">{examMeta.format}</p>
        </div>
        <div className="card p-5">
          <h2 className="text-sm font-semibold">Scoring</h2>
          <p className="mt-1 text-sm text-ink-soft dark:text-stone-300">{examMeta.scoring}</p>
        </div>
      </div>

      <h2 className="mb-3 mt-8 text-xl font-bold">Domains & weightings</h2>
      <div className="space-y-2">
        {domains.map((d) => (
          <Link key={d.id} to={`/exam/domain/${d.id}`} className="card flex items-center gap-4 p-4 transition hover:border-accent-400">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent-100 font-bold text-accent-700 dark:bg-accent-950 dark:text-accent-300">
              {d.num}
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-semibold">{d.title}</span>
              <span className="mt-0.5 block truncate text-sm text-ink-faint">{d.tasks.length} task statements</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-lg font-bold text-accent-600 dark:text-accent-400">{d.weight}%</span>
              <span className="text-xs text-ink-faint">weight</span>
            </span>
          </Link>
        ))}
      </div>

      <h2 className="mb-2 mt-8 text-xl font-bold">The 6 scenarios</h2>
      <p className="mb-3 max-w-reading text-sm text-ink-soft dark:text-stone-300">{examMeta.scenarioNote}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {examScenarios.map((s) => (
          <Link key={s.id} to={`/exam/scenario/${s.id}`} className="card p-4 transition hover:border-accent-400">
            <p className="text-xs text-ink-faint">Scenario {s.num}</p>
            <p className="font-semibold">{s.title}</p>
            <p className="mt-1 line-clamp-3 text-sm text-ink-soft dark:text-stone-300">{s.context}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/exam/quiz" className="rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700">
          Take the official 12-question quiz
        </Link>
        <Link to="/exam/practice" className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium dark:border-stone-700">
          Practice questions
        </Link>
        <Link to="/exam/reference" className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium dark:border-stone-700">
          Reference & scope
        </Link>
      </div>
    </div>
  )
}

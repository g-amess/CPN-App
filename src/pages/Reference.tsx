import { CheckCircle2, XCircle } from 'lucide-react'
import { useContent } from '../content/resolveContent'

export function Reference() {
  const { reference } = useContent()
  return (
    <div className="animate-fade-in max-w-4xl">
      <h1 className="text-3xl font-bold">Reference & Scope</h1>
      <p className="mt-2 max-w-reading text-ink-soft dark:text-stone-300">
        The appendix from the exam guide: technologies and concepts, the in-scope topic list, and — kept clearly
        separate — the topics that will <strong>not</strong> appear on the exam.
      </p>

      <h2 className="mb-3 mt-8 text-xl font-bold">Technologies & Concepts</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {reference.technologies.map((t) => (
          <div key={t.name} className="card p-4">
            <h3 className="font-semibold text-accent-700 dark:text-accent-300">{t.name}</h3>
            <p className="mt-1 text-sm text-ink-soft dark:text-stone-300">{t.detail}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-8 flex items-center gap-2 text-xl font-bold">
        <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
        In-Scope Topics
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {reference.inScope.map((t, i) => (
          <li key={i} className="flex gap-2 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 text-sm text-ink-soft dark:border-emerald-900 dark:bg-emerald-950/20 dark:text-stone-300">
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{t}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-xl border-2 border-amber-300 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-bold text-amber-800 dark:text-amber-300">
          <XCircle size={20} />
          Out-of-Scope Topics
        </h2>
        <p className="mb-3 text-sm text-amber-800/90 dark:text-amber-200/90">
          These related topics will <strong>NOT</strong> appear on the exam. Several are taught in the Build track
          for completeness and marked there as out of scope.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {reference.outOfScope.map((t, i) => (
            <li key={i} className="flex gap-2 text-sm text-amber-900 dark:text-amber-200">
              <XCircle size={15} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-500" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

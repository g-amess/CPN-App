import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookOpen, GraduationCap, ListChecks, HelpCircle, Library } from 'lucide-react'
import { search, type SearchKind } from '../lib/search'
import { useContent } from '../content/resolveContent'

const KIND_META: Record<SearchKind, { label: string; icon: typeof BookOpen }> = {
  lesson: { label: 'Lesson', icon: BookOpen },
  domain: { label: 'Domain', icon: GraduationCap },
  task: { label: 'Task statement', icon: ListChecks },
  question: { label: 'Question', icon: HelpCircle },
  concept: { label: 'Concept', icon: Library },
}

export function SearchPage() {
  const [params] = useSearchParams()
  const pack = useContent()
  const q = params.get('q') ?? ''
  const results = useMemo(() => search(q, pack), [q, pack])

  return (
    <div className="animate-fade-in max-w-3xl">
      <h1 className="text-2xl font-bold">
        Search results {q && <span className="font-normal text-ink-faint">for “{q}”</span>}
      </h1>
      <p className="mt-1 text-sm text-ink-faint">
        {results.length} result{results.length === 1 ? '' : 's'}
      </p>

      {results.length === 0 ? (
        <p className="mt-6 text-ink-soft dark:text-stone-300">
          {q.length < 2 ? 'Type at least two characters to search.' : 'No matches. Try a different term.'}
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {results.map((r, i) => {
            const meta = KIND_META[r.kind]
            const Icon = meta.icon
            return (
              <li key={i}>
                <Link to={r.to} className="card block p-4 transition hover:border-accent-400">
                  <div className="mb-1 flex items-center gap-2">
                    <Icon size={14} className="text-accent-600 dark:text-accent-400" />
                    <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">{meta.label}</span>
                  </div>
                  <p className="font-semibold">{r.title}</p>
                  <p className="mt-1 text-sm text-ink-soft dark:text-stone-300">{r.snippet}</p>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

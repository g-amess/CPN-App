import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../content/resolveContent'

export function Concepts() {
  const { conceptIndex } = useContent()
  const [filter, setFilter] = useState('')

  const grouped = useMemo(() => {
    const f = filter.trim().toLowerCase()
    const matches = conceptIndex
      .filter((c) => !f || c.term.toLowerCase().includes(f) || c.blurb.toLowerCase().includes(f))
      .slice()
      .sort((a, b) => a.term.localeCompare(b.term))
    const map = new Map<string, typeof matches>()
    for (const c of matches) {
      const letter = /[a-z]/i.test(c.term[0]) ? c.term[0].toUpperCase() : '#'
      if (!map.has(letter)) map.set(letter, [])
      map.get(letter)!.push(c)
    }
    return [...map.entries()]
  }, [filter])

  return (
    <div className="animate-fade-in max-w-4xl">
      <h1 className="text-3xl font-bold">Concept Index</h1>
      <p className="mt-2 max-w-reading text-ink-soft dark:text-stone-300">
        An A–Z of key terms across both tracks. Each links to where the concept is taught.
      </p>

      <input
        type="search"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter terms…"
        aria-label="Filter concepts"
        className="mt-4 w-full max-w-sm rounded-md border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
      />

      {grouped.length === 0 ? (
        <p className="mt-6 text-ink-faint">No terms match “{filter}”.</p>
      ) : (
        <div className="mt-6 space-y-6">
          {grouped.map(([letter, items]) => (
            <section key={letter}>
              <h2 className="mb-2 text-sm font-bold text-accent-600 dark:text-accent-400">{letter}</h2>
              <dl className="space-y-3">
                {items.map((c) => (
                  <div key={c.term} className="card p-4">
                    <dt className="font-semibold">{c.term}</dt>
                    <dd className="mt-1 text-sm text-ink-soft dark:text-stone-300">{c.blurb}</dd>
                    <dd className="mt-2 flex flex-wrap gap-1.5">
                      {c.links.map((l, i) => (
                        <Link
                          key={i}
                          to={l.to}
                          className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-medium text-ink-soft transition hover:bg-accent-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-accent-900"
                        >
                          {l.label}
                        </Link>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

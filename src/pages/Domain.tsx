import { Navigate, useParams, Link } from 'react-router-dom'
import { domains } from '../content/examTrack'
import { Markdown } from '../components/Markdown'

export function DomainPage() {
  const { domainId = '' } = useParams()
  const domain = domains.find((d) => d.id === domainId)
  if (!domain) return <Navigate to="/exam" replace />

  return (
    <div className="animate-fade-in max-w-4xl">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">
        Domain {domain.num} · {domain.weight}% of scored content
      </p>
      <h1 className="mt-1 text-3xl font-bold">{domain.title}</h1>
      <p className="mt-2 max-w-reading text-ink-soft dark:text-stone-300">{domain.blurb}</p>

      <div className="mt-6 space-y-5">
        {domain.tasks.map((t) => (
          <section key={t.id} className="card p-5">
            <h2 className="flex items-baseline gap-2 text-lg font-semibold">
              <span className="font-mono text-sm text-accent-600 dark:text-accent-400">{t.id.replace('t', '')}</span>
              {t.title}
            </h2>

            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">Knowledge of</h3>
                <ul className="space-y-1.5">
                  {t.knowledge.map((k, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink-soft dark:text-stone-300">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-stone-400" aria-hidden />
                      <span>{k}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-ink-faint">Skills in</h3>
                <ul className="space-y-1.5">
                  {t.skills.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-ink-soft dark:text-stone-300">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-400" aria-hidden />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 rounded-lg border-l-2 border-accent-400 bg-accent-50/50 p-3 dark:bg-accent-950/30">
              <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-700 dark:text-accent-400">
                Explanation
              </h3>
              <Markdown>{t.explanation}</Markdown>
            </div>

            {t.buildLinks && t.buildLinks.length > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-ink-faint">Learn in the Build track:</span>
                {t.buildLinks.map((b, i) => (
                  <Link
                    key={i}
                    to={`/build/${b.moduleId}/${b.lessonId}`}
                    className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-medium text-ink-soft transition hover:bg-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
                  >
                    {b.label}
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  )
}

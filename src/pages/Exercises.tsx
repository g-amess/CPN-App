import { useContent } from '../content/resolveContent'

export function Exercises() {
  const { exercises, domains } = useContent()
  const domainName = (id: string) => domains.find((d) => d.id === id)?.title ?? id

  return (
    <div className="animate-fade-in max-w-4xl">
      <h1 className="text-3xl font-bold">Preparation Exercises</h1>
      <p className="mt-2 max-w-reading text-ink-soft dark:text-stone-300">
        Hands-on exercises from the exam guide. Each builds practical familiarity across one or more domains — the
        best preparation is to actually build these.
      </p>

      <div className="mt-6 space-y-5">
        {exercises.map((ex) => (
          <section key={ex.id} className="card p-5">
            <div className="flex items-baseline gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent-100 font-bold text-accent-700 dark:bg-accent-950 dark:text-accent-300">
                {ex.num}
              </span>
              <h2 className="text-lg font-semibold">{ex.title}</h2>
            </div>
            <p className="mt-2 text-sm italic text-ink-soft dark:text-stone-300">{ex.objective}</p>

            <ol className="mt-3 space-y-2">
              {ex.steps.map((s, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-ink-soft dark:text-stone-300">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-stone-200 text-xs font-medium text-ink-soft dark:bg-stone-800 dark:text-stone-300">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>

            <div className="mt-4 flex flex-wrap gap-1.5">
              <span className="text-xs font-medium text-ink-faint">Reinforces:</span>
              {ex.domains.map((d) => (
                <span key={d} className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-ink-soft dark:bg-stone-800 dark:text-stone-300">
                  {domainName(d)}
                </span>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

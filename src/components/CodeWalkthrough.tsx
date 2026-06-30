import { useState } from 'react'
import { ChevronRight, RotateCcw } from 'lucide-react'
import type { Walkthrough } from '../content/types'
import { CodeBlock } from './CodeBlock'

export function CodeWalkthrough({ walkthrough }: { walkthrough: Walkthrough }) {
  const [revealed, setRevealed] = useState(1)
  const total = walkthrough.steps.length
  const shown = walkthrough.steps.slice(0, revealed)

  return (
    <section className="my-6">
      <h3 className="text-lg font-semibold">{walkthrough.title}</h3>
      <p className="mt-1 max-w-reading text-sm text-ink-soft dark:text-stone-300">{walkthrough.intro}</p>

      <ol className="mt-4 space-y-4">
        {shown.map((s, i) => (
          <li key={i} className="animate-fade-in">
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-ink dark:text-stone-200">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-accent-600 text-xs text-white">{i + 1}</span>
              Step {i + 1} of {total}
            </div>
            <p className="mb-1 max-w-reading text-sm text-ink-soft dark:text-stone-300">{s.commentary}</p>
            <CodeBlock code={s.code} lang={s.lang} />
          </li>
        ))}
      </ol>

      <div className="mt-3 flex gap-2">
        {revealed < total ? (
          <button
            onClick={() => setRevealed((r) => r + 1)}
            className="flex items-center gap-1 rounded-md bg-accent-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-700"
          >
            Reveal next step <ChevronRight size={15} />
          </button>
        ) : (
          <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Walkthrough complete.</span>
        )}
        {revealed > 1 && (
          <button
            onClick={() => setRevealed(1)}
            className="flex items-center gap-1 rounded-md border border-stone-300 px-3 py-1.5 text-sm dark:border-stone-700"
          >
            <RotateCcw size={14} /> Restart
          </button>
        )}
      </div>
    </section>
  )
}

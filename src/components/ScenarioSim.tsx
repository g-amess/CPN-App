import { useState } from 'react'
import { Check, X, ChevronRight } from 'lucide-react'
import type { ScenarioSim as Sim, OptionKey } from '../content/types'
import { useContent } from '../content/resolveContent'

export function ScenarioSim({ sim }: { sim: Sim }) {
  const { domains } = useContent()
  const domainName = (id: string) => domains.find((d) => d.id === id)?.title ?? id
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({})

  const total = sim.decisions.length
  const decision = sim.decisions[step]
  const chosen = answers[decision.id]
  const revealed = !!chosen

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">
        Scenario {sim.num} · Decision walkthrough
      </p>
      <h1 className="mt-1 text-2xl font-bold">{sim.title}</h1>
      <div className="mt-1 flex flex-wrap gap-1.5">
        {sim.primaryDomains.map((d) => (
          <span key={d} className="rounded-full bg-stone-200 px-2 py-0.5 text-xs text-ink-soft dark:bg-stone-800 dark:text-stone-300">
            {domainName(d)}
          </span>
        ))}
      </div>

      <div className="card mt-4 p-4 text-sm leading-relaxed text-ink-soft dark:text-stone-300">{sim.context}</div>

      {/* Progress dots */}
      <div className="mt-5 flex items-center gap-2">
        {sim.decisions.map((d, i) => (
          <button
            key={d.id}
            onClick={() => setStep(i)}
            aria-label={`Go to decision ${i + 1}`}
            className={`h-2.5 w-2.5 rounded-full transition ${
              i === step ? 'bg-accent-600' : answers[d.id] ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-700'
            }`}
          />
        ))}
        <span className="ml-2 text-xs text-ink-faint">Decision {step + 1} of {total}</span>
      </div>

      <div className="card mt-3 p-5">
        {decision.fromOfficialQuestion && (
          <span className="mb-2 inline-block rounded bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-800 dark:bg-accent-950 dark:text-accent-300">
            Official sample question
          </span>
        )}
        <p className="font-medium">{decision.prompt}</p>

        <div className="mt-3 space-y-2">
          {decision.options.map((o) => {
            const isCorrect = o.key === decision.correct
            const isChosen = o.key === chosen
            let cls = 'border-stone-300 hover:border-accent-400 dark:border-stone-700'
            if (revealed && isCorrect) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
            else if (revealed && isChosen && !isCorrect) cls = 'border-red-400 bg-red-50 dark:bg-red-950/40'
            return (
              <button
                key={o.key}
                type="button"
                disabled={revealed}
                onClick={() => setAnswers((a) => ({ ...a, [decision.id]: o.key }))}
                className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition disabled:cursor-default ${cls}`}
              >
                <span className="mt-0.5 font-mono font-semibold text-ink-faint">{o.key}</span>
                <span className="flex-1">{o.text}</span>
                {revealed && isCorrect && <Check size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />}
                {revealed && isChosen && !isCorrect && <X size={16} className="mt-0.5 shrink-0 text-red-500" />}
              </button>
            )
          })}
        </div>

        {revealed && (
          <div className="mt-4 animate-fade-in rounded-lg bg-stone-100 p-4 text-sm dark:bg-stone-800/60">
            <p className="mb-1 font-semibold">
              {chosen === decision.correct ? (
                <span className="text-emerald-600 dark:text-emerald-400">Correct — {decision.correct}.</span>
              ) : (
                <span className="text-red-500">Best answer: {decision.correct}.</span>
              )}
            </p>
            <p className="text-ink-soft dark:text-stone-300">{decision.reveal}</p>
            {step < total - 1 && (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="mt-3 flex items-center gap-1 rounded-md bg-accent-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-700"
              >
                Next decision <ChevronRight size={15} />
              </button>
            )}
            {step === total - 1 && (
              <p className="mt-3 font-medium text-emerald-600 dark:text-emerald-400">
                You’ve completed all decisions in this scenario.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

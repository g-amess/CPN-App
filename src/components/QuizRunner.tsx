import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, X, RotateCcw } from 'lucide-react'
import type { Question, OptionKey } from '../content/types'
import { useContent } from '../content/resolveContent'
import { aggregateByDomain, countCorrect, weightedPct, toScaled, type PerDomain } from '../lib/quiz'
import { useProgress, type QuizAttempt } from '../lib/progress'

interface Props {
  questions: Question[]
  kind: QuizAttempt['kind']
  title: string
  intro?: React.ReactNode
  /** Show the domain-weighted scaled score on the results screen. */
  weighted?: boolean
}

export function QuizRunner({ questions, kind, title, intro, weighted }: Props) {
  const { domains } = useContent()
  const domainName = (id: string) => domains.find((d) => d.id === id)?.title ?? id
  const domainWeights = Object.fromEntries(domains.map((d) => [d.id, d.weight]))
  const { recordQuiz } = useProgress()
  const [answers, setAnswers] = useState<Record<string, OptionKey | undefined>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const [finished, setFinished] = useState(false)
  const [nonce, setNonce] = useState(0)

  const choose = (qid: string, key: OptionKey) => {
    if (revealed[qid]) return
    setAnswers((a) => ({ ...a, [qid]: key }))
    setRevealed((r) => ({ ...r, [qid]: true }))
  }

  const answeredCount = Object.keys(revealed).length
  const allAnswered = answeredCount === questions.length

  const finish = () => {
    const perDomain = aggregateByDomain(questions, answers)
    const correct = countCorrect(questions, answers)
    const attempt: QuizAttempt = {
      id: `${kind}-${nonce}-${questions.length}-${Date.now()}`,
      kind,
      date: Date.now(),
      total: questions.length,
      correct,
      perDomain,
      weightedPct: weighted ? weightedPct(perDomain, domainWeights) : undefined,
    }
    recordQuiz(attempt)
    setFinished(true)
  }

  const restart = () => {
    setAnswers({})
    setRevealed({})
    setFinished(false)
    setNonce((n) => n + 1)
  }

  if (finished) {
    const perDomain = aggregateByDomain(questions, answers)
    const correct = countCorrect(questions, answers)
    const pct = Math.round((correct / questions.length) * 100)
    const wPct = weighted ? weightedPct(perDomain, domainWeights) : pct
    const scaled = toScaled(wPct)
    const passed = scaled >= 720
    return (
      <div key={nonce} className="animate-fade-in">
        <h1 className="text-2xl font-bold">{title} — Results</h1>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="card p-5">
            <p className="text-sm text-ink-faint">Score</p>
            <p className="mt-1 text-3xl font-bold">
              {correct} / {questions.length} <span className="text-lg font-normal text-ink-faint">({pct}%)</span>
            </p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-ink-faint">{weighted ? 'Domain-weighted scaled score' : 'Scaled-style score'}</p>
            <p className={`mt-1 text-3xl font-bold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-accent-600 dark:text-accent-400'}`}>
              {scaled} <span className="text-lg font-normal">{passed ? 'Pass' : 'Below 720'}</span>
            </p>
            <p className="mt-1 text-xs text-ink-faint">Exam pass mark is 720 / 1000.</p>
          </div>
        </div>

        <h2 className="mb-2 mt-6 text-lg font-semibold">Per-domain performance</h2>
        <div className="space-y-2">
          {Object.entries(perDomain).map(([id, pd]: [string, PerDomain]) => {
            const p = Math.round((pd.correct / pd.total) * 100)
            return (
              <div key={id} className="card flex items-center gap-3 p-3">
                <span className="w-48 shrink-0 text-sm font-medium">{domainName(id)}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
                  <div className={`h-full ${p >= 70 ? 'bg-emerald-500' : 'bg-accent-500'}`} style={{ width: `${p}%` }} />
                </div>
                <span className="w-16 shrink-0 text-right text-sm tabular-nums text-ink-faint">{pd.correct}/{pd.total}</span>
              </div>
            )
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <button onClick={restart} className="flex items-center gap-2 rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700">
            <RotateCcw size={15} /> Retake
          </button>
          <Link to="/" className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium dark:border-stone-700">Dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div key={nonce}>
      <h1 className="text-2xl font-bold">{title}</h1>
      {intro && <div className="mt-2 max-w-reading text-sm text-ink-soft dark:text-stone-300">{intro}</div>}
      <p className="mt-3 text-sm text-ink-faint">Answered {answeredCount} of {questions.length}</p>

      <ol className="mt-4 space-y-6">
        {questions.map((q, i) => {
          const chosen = answers[q.id]
          const isRevealed = revealed[q.id]
          return (
            <li key={q.id} className="card p-5">
              {q.scenarioTitle && (
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">
                  {q.scenarioTitle}
                </p>
              )}
              <p className="font-medium">
                <span className="text-ink-faint">{i + 1}.</span> {q.question}
              </p>
              <div className="mt-3 space-y-2" role="group" aria-label={`Question ${i + 1} options`}>
                {q.options.map((o) => {
                  const isCorrect = o.key === q.correct
                  const isChosen = o.key === chosen
                  let cls = 'border-stone-300 hover:border-accent-400 dark:border-stone-700'
                  if (isRevealed && isCorrect) cls = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40'
                  else if (isRevealed && isChosen && !isCorrect) cls = 'border-red-400 bg-red-50 dark:bg-red-950/40'
                  return (
                    <button
                      key={o.key}
                      type="button"
                      disabled={isRevealed}
                      onClick={() => choose(q.id, o.key)}
                      className={`flex w-full items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition disabled:cursor-default ${cls}`}
                    >
                      <span className="mt-0.5 font-mono font-semibold text-ink-faint">{o.key}</span>
                      <span className="flex-1">{o.text}</span>
                      {isRevealed && isCorrect && <Check size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />}
                      {isRevealed && isChosen && !isCorrect && <X size={16} className="mt-0.5 shrink-0 text-red-500" />}
                    </button>
                  )
                })}
              </div>
              {isRevealed && (
                <div className="mt-3 animate-fade-in rounded-lg bg-stone-100 p-3 text-sm dark:bg-stone-800/60">
                  <p className="mb-1 font-semibold">
                    {chosen === q.correct ? (
                      <span className="text-emerald-600 dark:text-emerald-400">Correct.</span>
                    ) : (
                      <span className="text-red-500">Not quite — correct answer: {q.correct}.</span>
                    )}
                  </p>
                  <p className="text-ink-soft dark:text-stone-300">{q.explanation}</p>
                </div>
              )}
            </li>
          )
        })}
      </ol>

      <div className="sticky bottom-4 mt-6 flex justify-center">
        <button
          onClick={finish}
          disabled={!allAnswered}
          className="rounded-full bg-accent-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-accent-700 disabled:cursor-not-allowed disabled:bg-stone-300 dark:disabled:bg-stone-700"
        >
          {allAnswered ? 'See results' : `Answer all ${questions.length} to finish`}
        </button>
      </div>
    </div>
  )
}

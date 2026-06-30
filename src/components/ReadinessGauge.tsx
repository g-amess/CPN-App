import { useMemo } from 'react'
import { Gauge } from 'lucide-react'
import type { QuizAttempt } from '../lib/progress'
import { weightedPct, toScaled, type PerDomain } from '../lib/quiz'

const PASS = 720
const MIN = 100
const MAX = 1000

/** Local exam-readiness estimate from all quiz history, weighted 27/18/20/20/15 and
 *  mapped to the 100–1000 scaled band against the 720 pass line. */
export function ReadinessGauge({ history }: { history: QuizAttempt[] }) {
  const { scaled, hasData, attempts, answered } = useMemo(() => {
    const agg: Record<string, PerDomain> = {}
    let answered = 0
    for (const a of history) {
      for (const [id, pd] of Object.entries(a.perDomain)) {
        const d = (agg[id] ??= { correct: 0, total: 0 })
        d.correct += pd.correct
        d.total += pd.total
        answered += pd.total
      }
    }
    const hasData = answered > 0
    return { scaled: toScaled(weightedPct(agg)), hasData, attempts: history.length, answered }
  }, [history])

  const pct = (v: number) => ((v - MIN) / (MAX - MIN)) * 100
  const passed = scaled >= PASS

  return (
    <section className="card p-5">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
        <Gauge size={17} className="text-accent-600 dark:text-accent-400" />
        Exam readiness
      </h2>

      {!hasData ? (
        <p className="mt-2 text-sm text-ink-soft dark:text-stone-300">
          Answer some quiz questions to estimate your readiness. Your score is weighted by the exam’s
          domain weightings (27/18/20/20/15) and shown against the 720 pass line.
        </p>
      ) : (
        <>
          <div className="mt-2 flex items-end gap-3">
            <span className={`text-4xl font-bold tabular-nums ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-accent-600 dark:text-accent-400'}`}>
              {scaled}
            </span>
            <span className="pb-1 text-sm text-ink-faint">/ 1000 scaled · pass = {PASS}</span>
            <span className={`ml-auto pb-1 text-sm font-semibold ${passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-ink-faint'}`}>
              {passed ? 'On track to pass' : `${PASS - scaled} below pass`}
            </span>
          </div>

          {/* Track with a pass-line marker */}
          <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
            <div
              className={`h-full rounded-full ${passed ? 'bg-emerald-500' : 'bg-accent-500'}`}
              style={{ width: `${Math.max(0, Math.min(100, pct(scaled)))}%` }}
            />
          </div>
          <div className="relative h-4">
            <div
              className="absolute top-0 -translate-x-1/2 text-[10px] text-ink-faint"
              style={{ left: `${pct(PASS)}%` }}
            >
              <div className="mx-auto h-2 w-px bg-ink-faint" />
              720
            </div>
          </div>

          <p className="mt-1 text-xs text-ink-faint">
            Based on {answered} answered question{answered === 1 ? '' : 's'} across {attempts} quiz attempt{attempts === 1 ? '' : 's'}.
            An estimate from your practice history — not an official score.
          </p>
        </>
      )}
    </section>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, GraduationCap, Layers, Trophy, AlertTriangle, ArrowRight, Trash2 } from 'lucide-react'
import { totalLessons, buildModules, lessonById } from '../content/buildTrack'
import { flashcards } from '../content/flashcards'
import { domains } from '../content/examTrack'
import { useProgress } from '../lib/progress'
import { bucketOf } from '../lib/srs'
import { ReadinessGauge } from '../components/ReadinessGauge'

const domainName = (id: string) => domains.find((d) => d.id === id)?.title ?? id

function ProgressBar({ value, color = 'bg-accent-500' }: { value: number; color?: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-800">
      <div className={`h-full ${color} transition-all`} style={{ width: `${value}%` }} />
    </div>
  )
}

export function Dashboard() {
  const { store, resetAll } = useProgress()
  const now = Date.now()
  const [confirmReset, setConfirmReset] = useState(false)

  const buildPct = Math.round((store.lessonsCompleted.length / totalLessons) * 100)

  const cardStats = useMemo(() => {
    let due = 0, learned = 0
    for (const c of flashcards) {
      const b = bucketOf(store.flashcards[c.id], now)
      if (b === 'due') due++
      else if (b === 'learned') learned++
    }
    const newCount = flashcards.length - due - learned
    return { due, learned, new: newCount, total: flashcards.length }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.flashcards])

  // Aggregate per-domain performance across all quiz history.
  const domainPerf = useMemo(() => {
    const agg: Record<string, { correct: number; total: number }> = {}
    for (const a of store.quizHistory) {
      for (const [id, pd] of Object.entries(a.perDomain)) {
        const d = (agg[id] ??= { correct: 0, total: 0 })
        d.correct += pd.correct
        d.total += pd.total
      }
    }
    return domains
      .map((d) => {
        const pd = agg[d.id]
        return { id: d.id, name: d.title, weight: d.weight, pct: pd && pd.total ? Math.round((pd.correct / pd.total) * 100) : null }
      })
      .sort((a, b) => (a.pct ?? 999) - (b.pct ?? 999))
  }, [store.quizHistory])

  const bestOfficial = useMemo(() => {
    const officials = store.quizHistory.filter((a) => a.kind === 'official')
    if (!officials.length) return null
    return Math.max(...officials.map((a) => Math.round((a.correct / a.total) * 100)))
  }, [store.quizHistory])

  const lastLesson = store.lastVisited.startsWith('#/build') || store.lastVisited.startsWith('/build') ? store.lastVisited : null
  const resumeLessonTitle = (() => {
    const m = store.lastVisited.match(/\/build\/[^/]+\/([^/?#]+)/)
    return m ? lessonById(m[1])?.title : undefined
  })()

  const examReviewed = store.quizHistory.length > 0

  return (
    <div className="animate-fade-in max-w-5xl">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-ink-soft dark:text-stone-300">Your progress across both tracks — saved locally in your browser.</p>

      {/* Resume */}
      {lastLesson && resumeLessonTitle && (
        <Link to={store.lastVisited.replace(/^#/, '')} className="card mt-5 flex items-center gap-3 p-4 transition hover:border-accent-400">
          <ArrowRight size={18} className="text-accent-600 dark:text-accent-400" />
          <span className="flex-1">
            <span className="block text-xs text-ink-faint">Continue where you left off</span>
            <span className="font-medium">{resumeLessonTitle}</span>
          </span>
        </Link>
      )}

      {/* Top cards */}
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 text-ink-faint"><BookOpen size={16} /><span className="text-sm">Build lessons</span></div>
          <p className="mt-2 text-3xl font-bold">{store.lessonsCompleted.length}<span className="text-lg font-normal text-ink-faint">/{totalLessons}</span></p>
          <div className="mt-3"><ProgressBar value={buildPct} /></div>
          <p className="mt-1 text-xs text-ink-faint">{buildPct}% complete</p>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 text-ink-faint"><Layers size={16} /><span className="text-sm">Flashcards</span></div>
          <p className="mt-2 text-3xl font-bold">{cardStats.due + cardStats.new}<span className="text-lg font-normal text-ink-faint"> to review</span></p>
          <p className="mt-1 text-xs text-ink-faint">{cardStats.learned} learned · {cardStats.total} total</p>
          <Link to="/flashcards" className="mt-3 inline-block text-sm font-medium text-accent-700 hover:underline dark:text-accent-300">Study now →</Link>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 text-ink-faint"><Trophy size={16} /><span className="text-sm">Best official quiz</span></div>
          <p className="mt-2 text-3xl font-bold">{bestOfficial !== null ? `${bestOfficial}%` : '—'}</p>
          <p className="mt-1 text-xs text-ink-faint">{store.quizHistory.length} attempt{store.quizHistory.length === 1 ? '' : 's'} recorded</p>
          <Link to="/exam/quiz" className="mt-3 inline-block text-sm font-medium text-accent-700 hover:underline dark:text-accent-300">Take quiz →</Link>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 text-ink-faint"><GraduationCap size={16} /><span className="text-sm">Exam track</span></div>
          <p className="mt-2 text-3xl font-bold">{domains.length}<span className="text-lg font-normal text-ink-faint"> domains</span></p>
          <p className="mt-1 text-xs text-ink-faint">27 / 18 / 20 / 20 / 15 weighting</p>
          <Link to="/exam" className="mt-3 inline-block text-sm font-medium text-accent-700 hover:underline dark:text-accent-300">Overview →</Link>
        </div>
      </div>

      {/* Exam-readiness gauge */}
      <div className="mt-6">
        <ReadinessGauge history={store.quizHistory} />
      </div>

      {/* Per-track progress detail + weakest domains */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="mb-3 text-lg font-semibold">Build track by module</h2>
          <div className="space-y-3">
            {buildModules.map((m) => {
              const done = m.lessons.filter((l) => store.lessonsCompleted.includes(l.id)).length
              const pct = Math.round((done / m.lessons.length) * 100)
              return (
                <div key={m.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">{m.title}</span>
                    <span className="text-ink-faint">{done}/{m.lessons.length}</span>
                  </div>
                  <ProgressBar value={pct} color={pct === 100 ? 'bg-emerald-500' : 'bg-accent-500'} />
                </div>
              )
            })}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="mb-1 flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle size={17} className="text-accent-600 dark:text-accent-400" />
            Weakest exam domains
          </h2>
          {!examReviewed ? (
            <p className="mt-2 text-sm text-ink-soft dark:text-stone-300">
              Take the <Link to="/exam/quiz" className="text-accent-700 underline dark:text-accent-300">official quiz</Link> or some{' '}
              <Link to="/exam/practice" className="text-accent-700 underline dark:text-accent-300">practice questions</Link> to see where to focus.
            </p>
          ) : (
            <div className="mt-3 space-y-3">
              {domainPerf.map((d) => (
                <div key={d.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <Link to={`/exam/domain/${d.id}`} className="font-medium hover:text-accent-600">{domainName(d.id)}</Link>
                    <span className="text-ink-faint">{d.pct === null ? 'not tested' : `${d.pct}%`}</span>
                  </div>
                  {d.pct !== null && <ProgressBar value={d.pct} color={d.pct >= 70 ? 'bg-emerald-500' : d.pct >= 50 ? 'bg-amber-500' : 'bg-red-500'} />}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Reset */}
      <div className="mt-8 border-t border-stone-200 pt-5 dark:border-stone-800">
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="flex items-center gap-2 text-sm text-ink-faint hover:text-red-600 dark:hover:text-red-400">
            <Trash2 size={15} /> Reset all progress
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-soft dark:text-stone-300">Erase lessons completed, flashcard schedule, and quiz history?</span>
            <button onClick={() => { resetAll(); setConfirmReset(false) }} className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700">Yes, reset</button>
            <button onClick={() => setConfirmReset(false)} className="rounded-md border border-stone-300 px-3 py-1.5 text-sm dark:border-stone-700">Cancel</button>
          </div>
        )}
      </div>
    </div>
  )
}

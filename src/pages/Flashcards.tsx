import { useMemo, useState } from 'react'
import { RotateCcw, Download } from 'lucide-react'
import { flashcards } from '../content/flashcards'
import { Flashcard } from '../components/Flashcard'
import { useProgress } from '../lib/progress'
import { bucketOf, type Grade } from '../lib/srs'
import { downloadFile, toTSV } from '../lib/exportImport'

type TrackFilter = 'all' | 'build' | 'exam'

// Distinct groups for the secondary filter.
const groups = Array.from(new Map(flashcards.map((c) => [c.group, { id: c.group, label: c.groupLabel, track: c.track }])).values())

export function Flashcards() {
  const { store, gradeCard } = useProgress()
  const [trackFilter, setTrackFilter] = useState<TrackFilter>('all')
  const [groupFilter, setGroupFilter] = useState<string>('all')
  const [queue, setQueue] = useState<string[] | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [reviewed, setReviewed] = useState(0)

  const now = Date.now()

  const pool = useMemo(
    () =>
      flashcards.filter(
        (c) => (trackFilter === 'all' || c.track === trackFilter) && (groupFilter === 'all' || c.group === groupFilter),
      ),
    [trackFilter, groupFilter],
  )

  const counts = useMemo(() => {
    let nw = 0, due = 0, learned = 0
    for (const c of pool) {
      const b = bucketOf(store.flashcards[c.id], now)
      if (b === 'new') nw++
      else if (b === 'due') due++
      else learned++
    }
    return { new: nw, due, learned }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool, store.flashcards])

  const startSession = () => {
    const dueIds = pool
      .filter((c) => bucketOf(store.flashcards[c.id], Date.now()) !== 'learned')
      .map((c) => c.id)
    setQueue(dueIds)
    setFlipped(false)
    setReviewed(0)
  }

  const currentCard = queue && queue.length > 0 ? flashcards.find((c) => c.id === queue[0]) : undefined

  const onGrade = (g: Grade) => {
    if (!queue || queue.length === 0) return
    const id = queue[0]
    gradeCard(id, g)
    setReviewed((r) => r + 1)
    setQueue((q) => {
      if (!q) return q
      const rest = q.slice(1)
      // 'again' repeats the card later in the same session.
      return g === 'again' ? [...rest, id] : rest
    })
    setFlipped(false)
  }

  const availableGroups = groups.filter((g) => trackFilter === 'all' || g.track === trackFilter)

  return (
    <div className="animate-fade-in max-w-2xl">
      <h1 className="text-3xl font-bold">Flashcards</h1>
      <p className="mt-2 text-ink-soft dark:text-stone-300">
        A spaced-repetition deck (SM-2 scheduler) across both tracks. Grade each card to schedule its next review;
        progress is saved automatically.
      </p>

      {/* Counts */}
      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-sky-600 dark:text-sky-400">{counts.new}</p>
          <p className="text-xs text-ink-faint">New</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-accent-600 dark:text-accent-400">{counts.due}</p>
          <p className="text-xs text-ink-faint">Due</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{counts.learned}</p>
          <p className="text-xs text-ink-faint">Learned</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-3">
        <label className="text-sm">
          <span className="mr-1.5 text-ink-faint">Track</span>
          <select
            value={trackFilter}
            onChange={(e) => { setTrackFilter(e.target.value as TrackFilter); setGroupFilter('all'); setQueue(null) }}
            className="rounded-md border border-stone-300 bg-white px-2 py-1 dark:border-stone-700 dark:bg-stone-900"
          >
            <option value="all">All</option>
            <option value="build">Build</option>
            <option value="exam">Exam</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mr-1.5 text-ink-faint">Group</span>
          <select
            value={groupFilter}
            onChange={(e) => { setGroupFilter(e.target.value); setQueue(null) }}
            className="max-w-[240px] rounded-md border border-stone-300 bg-white px-2 py-1 dark:border-stone-700 dark:bg-stone-900"
          >
            <option value="all">All groups</option>
            {availableGroups.map((g) => (
              <option key={g.id} value={g.id}>{g.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Export */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => downloadFile('claude-mastery-flashcards.txt', toTSV(flashcards))}
          className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-sm dark:border-stone-700"
        >
          <Download size={14} /> Export all ({flashcards.length})
        </button>
        <button
          type="button"
          onClick={() => downloadFile('claude-mastery-flashcards-selection.txt', toTSV(pool))}
          disabled={pool.length === flashcards.length || pool.length === 0}
          className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-stone-700"
        >
          <Download size={14} /> Export selection ({pool.length})
        </button>
        <span className="text-xs text-ink-faint">Tab-separated .txt — ready for Quizlet import.</span>
      </div>

      {/* Session */}
      <div className="mt-6">
        {queue === null ? (
          <button
            onClick={startSession}
            disabled={counts.new + counts.due === 0}
            className="rounded-lg bg-accent-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-700 disabled:cursor-not-allowed disabled:bg-stone-300 dark:disabled:bg-stone-700"
          >
            {counts.new + counts.due === 0 ? 'Nothing due — all learned!' : `Start session (${counts.new + counts.due} cards)`}
          </button>
        ) : currentCard ? (
          <div>
            <p className="mb-2 text-sm text-ink-faint">{queue.length} remaining · {reviewed} reviewed this session</p>
            <Flashcard card={currentCard} flipped={flipped} onFlip={() => setFlipped(true)} onGrade={onGrade} />
          </div>
        ) : (
          <div className="card p-8 text-center">
            <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">Session complete!</p>
            <p className="mt-1 text-sm text-ink-faint">You reviewed {reviewed} card{reviewed === 1 ? '' : 's'}.</p>
            <button onClick={() => setQueue(null)} className="mt-4 inline-flex items-center gap-2 rounded-md border border-stone-300 px-4 py-2 text-sm font-medium dark:border-stone-700">
              <RotateCcw size={15} /> Back to deck
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

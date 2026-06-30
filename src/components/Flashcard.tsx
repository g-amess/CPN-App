import { useEffect } from 'react'
import type { Flashcard as Card } from '../content/types'
import type { Grade } from '../lib/srs'

const GRADES: { grade: Grade; label: string; key: string; cls: string }[] = [
  { grade: 'again', label: 'Again', key: '1', cls: 'bg-red-500 hover:bg-red-600' },
  { grade: 'hard', label: 'Hard', key: '2', cls: 'bg-amber-500 hover:bg-amber-600' },
  { grade: 'good', label: 'Good', key: '3', cls: 'bg-emerald-500 hover:bg-emerald-600' },
  { grade: 'easy', label: 'Easy', key: '4', cls: 'bg-sky-500 hover:bg-sky-600' },
]

export function Flashcard({
  card,
  flipped,
  onFlip,
  onGrade,
}: {
  card: Card
  flipped: boolean
  onFlip: () => void
  onGrade: (g: Grade) => void
}) {
  // Keyboard: space/enter flips; 1–4 grade once flipped.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (!flipped && (e.code === 'Space' || e.code === 'Enter')) {
        e.preventDefault()
        onFlip()
      } else if (flipped) {
        const g = GRADES.find((x) => x.key === e.key)
        if (g) {
          e.preventDefault()
          onGrade(g.grade)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipped, onFlip, onGrade])

  return (
    <div>
      <div
        role="button"
        tabIndex={0}
        onClick={() => !flipped && onFlip()}
        onKeyDown={(e) => {
          if (!flipped && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault()
            onFlip()
          }
        }}
        aria-label={flipped ? 'Card answer' : 'Card term — activate to reveal answer'}
        className="card grid min-h-[260px] cursor-pointer place-items-center p-8 text-center"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">
            {card.groupLabel}
          </p>
          <p className="mt-3 text-2xl font-semibold text-ink dark:text-stone-100">{card.term}</p>
          {flipped ? (
            <p className="mx-auto mt-4 max-w-md text-ink-soft dark:text-stone-300">{card.def}</p>
          ) : (
            <p className="mt-4 text-sm text-ink-faint">Click or press Space to flip</p>
          )}
        </div>
      </div>

      {flipped && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {GRADES.map((g) => (
            <button
              key={g.grade}
              onClick={() => onGrade(g.grade)}
              className={`rounded-lg px-2 py-2.5 text-sm font-medium text-white transition ${g.cls}`}
            >
              {g.label}
              <span className="ml-1 text-xs opacity-80">{g.key}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

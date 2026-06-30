// Lightweight SM-2-style spaced-repetition scheduler.
// One card state per flashcard id, persisted in the progress store.

export type Grade = 'again' | 'hard' | 'good' | 'easy'

export interface CardState {
  /** Ease factor (SM-2 EF), floored at 1.3. */
  ease: number
  /** Current interval in days. */
  interval: number
  /** Consecutive successful reviews. */
  reps: number
  /** Epoch ms when the card is next due. */
  due: number
  /** Whether the card has ever been reviewed. */
  seen: boolean
}

export const DAY_MS = 24 * 60 * 60 * 1000

export function freshCard(): CardState {
  return { ease: 2.5, interval: 0, reps: 0, due: 0, seen: false }
}

/**
 * Apply a grade to a card and return its next state.
 * Intervals are deliberately gentle so a study session shows visible movement.
 */
export function schedule(prev: CardState, grade: Grade, now: number): CardState {
  let { ease, interval, reps } = prev

  if (grade === 'again') {
    return { ease: Math.max(1.3, ease - 0.2), interval: 0, reps: 0, due: now, seen: true }
  }

  // Adjust ease per SM-2 quality mapping.
  const delta = grade === 'hard' ? -0.15 : grade === 'good' ? 0 : 0.15
  ease = Math.max(1.3, ease + delta)

  reps += 1
  if (reps === 1) {
    interval = grade === 'easy' ? 3 : 1
  } else if (reps === 2) {
    interval = grade === 'hard' ? 3 : 6
  } else {
    const mult = grade === 'hard' ? 1.2 : ease
    interval = Math.round(interval * mult)
  }
  interval = Math.max(1, interval)

  return { ease, interval, reps, due: now + interval * DAY_MS, seen: true }
}

export type CardBucket = 'new' | 'due' | 'learned'

export function bucketOf(state: CardState | undefined, now: number): CardBucket {
  if (!state || !state.seen) return 'new'
  if (state.due <= now) return 'due'
  return 'learned'
}

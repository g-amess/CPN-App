import type { Question, OptionKey } from '../content/types'

// Official exam domain weightings (sum to 100).
export const DOMAIN_WEIGHTS: Record<string, number> = {
  d1: 27,
  d2: 18,
  d3: 20,
  d4: 20,
  d5: 15,
}

export interface PerDomain {
  correct: number
  total: number
}

export function aggregateByDomain(
  questions: Question[],
  answers: Record<string, OptionKey | undefined>,
): Record<string, PerDomain> {
  const out: Record<string, PerDomain> = {}
  for (const q of questions) {
    const d = (out[q.domainId] ??= { correct: 0, total: 0 })
    d.total += 1
    if (answers[q.id] === q.correct) d.correct += 1
  }
  return out
}

export function countCorrect(
  questions: Question[],
  answers: Record<string, OptionKey | undefined>,
): number {
  return questions.reduce((n, q) => n + (answers[q.id] === q.correct ? 1 : 0), 0)
}

/**
 * Domain-weighted percentage mirroring the exam's 27/18/20/20/15 split.
 * Each domain contributes its weight × (correct / total in that domain).
 * Domains absent from the quiz are dropped and weights renormalised.
 */
export function weightedPct(perDomain: Record<string, PerDomain>): number {
  let weighted = 0
  let weightSum = 0
  for (const [domainId, { correct, total }] of Object.entries(perDomain)) {
    if (total === 0) continue
    const w = DOMAIN_WEIGHTS[domainId] ?? 0
    weighted += w * (correct / total)
    weightSum += w
  }
  if (weightSum === 0) return 0
  return Math.round((weighted / weightSum) * 100)
}

/** Map a 0–100 percentage onto the exam's 100–1000 scaled band (pass = 720). */
export function toScaled(pct: number): number {
  return Math.round(100 + (pct / 100) * 900)
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

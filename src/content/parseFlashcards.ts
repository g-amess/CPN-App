import type { Flashcard, TrackId } from './types'

// Parses a Q/A flashcard deck authored in Markdown into typed Flashcard records.
// Format:
//   # Category Header        → sets the current category for cards that follow
//   Q: question text         → single-line question
//   A: answer text           → single-line answer (Q/A must be adjacent, blank lines optional)
//   <!-- ... -->             → HTML comments, ignored (single-line or multi-line)
// The parser assigns deterministic ids of the form `<idPrefix>-<category-slug>-<n>` so
// SM-2 progress stays stable across rebuilds unless a card's group or position changes.

export interface ParseOptions {
  track: TrackId
  /** Namespace prefix for both card ids and group ids (e.g. 'ccarf'). */
  idPrefix: string
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[_/:,()]/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function parseFlashcardDeck(source: string, opts: ParseOptions): Flashcard[] {
  const cards: Flashcard[] = []
  const lines = source.split(/\r?\n/)

  let currentLabel: string | null = null
  let currentSlug: string | null = null
  let indexInGroup = 0
  let pendingQuestion: string | null = null
  let inBlockComment = false

  for (const raw of lines) {
    const line = raw.trim()

    if (inBlockComment) {
      if (line.includes('-->')) inBlockComment = false
      continue
    }
    if (line.startsWith('<!--')) {
      if (!line.includes('-->')) inBlockComment = true
      continue
    }
    if (!line) continue

    if (line.startsWith('#')) {
      currentLabel = line.replace(/^#+\s*/, '').trim()
      currentSlug = slugify(currentLabel)
      indexInGroup = 0
      pendingQuestion = null
      continue
    }

    if (line.startsWith('Q:')) {
      pendingQuestion = line.slice(2).trim()
      continue
    }

    if (line.startsWith('A:')) {
      if (pendingQuestion == null || !currentLabel || !currentSlug) {
        pendingQuestion = null
        continue
      }
      indexInGroup += 1
      const n = String(indexInGroup).padStart(2, '0')
      cards.push({
        id: `${opts.idPrefix}-${currentSlug}-${n}`,
        term: pendingQuestion,
        def: line.slice(2).trim(),
        track: opts.track,
        group: `${opts.idPrefix}-${currentSlug}`,
        groupLabel: currentLabel,
      })
      pendingQuestion = null
    }
  }

  return cards
}

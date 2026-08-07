import type { ContentPack } from '../content/pack'

export type SearchKind = 'lesson' | 'domain' | 'task' | 'question' | 'concept'

export interface SearchResult {
  kind: SearchKind
  title: string
  snippet: string
  to: string
  track: 'build' | 'exam' | 'shared'
  score: number
}

interface IndexDoc {
  kind: SearchKind
  title: string
  body: string
  to: string
  track: 'build' | 'exam' | 'shared'
}

function buildIndex(pack: ContentPack): IndexDoc[] {
  const index: IndexDoc[] = []

  for (const m of pack.buildModules) {
    for (const l of m.lessons) {
      index.push({
        kind: 'lesson',
        title: l.title,
        body: `${l.summary} ${l.body} ${l.keyTakeaways.join(' ')} ${m.title}`,
        to: `/build/${m.id}/${l.id}`,
        track: 'build',
      })
    }
  }

  for (const d of pack.domains) {
    index.push({
      kind: 'domain',
      title: `Domain ${d.num}: ${d.title}`,
      body: `${d.blurb} ${d.tasks.map((t) => t.title).join(' ')}`,
      to: `/exam/domain/${d.id}`,
      track: 'exam',
    })
    for (const t of d.tasks) {
      index.push({
        kind: 'task',
        title: t.title,
        body: `${t.explanation} ${t.knowledge.join(' ')} ${t.skills.join(' ')}`,
        to: `/exam/domain/${d.id}`,
        track: 'exam',
      })
    }
  }

  for (const q of [...pack.sampleQuestions, ...pack.practiceQuestions]) {
    index.push({
      kind: 'question',
      title: q.question.slice(0, 80) + (q.question.length > 80 ? '…' : ''),
      body: `${q.question} ${q.options.map((o) => o.text).join(' ')} ${q.explanation}`,
      to: q.source === 'official' ? '/exam/quiz' : '/exam/practice',
      track: 'exam',
    })
  }

  for (const c of pack.conceptIndex) {
    index.push({
      kind: 'concept',
      title: c.term,
      body: `${c.term} ${c.blurb}`,
      to: c.links[0]?.to ?? '/concepts',
      track: 'shared',
    })
  }

  return index
}

function snippetFor(body: string, terms: string[]): string {
  const lower = body.toLowerCase()
  let pos = -1
  for (const t of terms) {
    const i = lower.indexOf(t)
    if (i !== -1 && (pos === -1 || i < pos)) pos = i
  }
  if (pos === -1) return body.slice(0, 140).trim() + '…'
  const start = Math.max(0, pos - 50)
  return (start > 0 ? '…' : '') + body.slice(start, start + 160).trim().replace(/\s+/g, ' ') + '…'
}

export function search(query: string, pack: ContentPack, limit = 40): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (q.length < 2) return []
  const terms = q.split(/\s+/).filter(Boolean)
  const index = buildIndex(pack)

  const results: SearchResult[] = []
  for (const doc of index) {
    const title = doc.title.toLowerCase()
    const body = doc.body.toLowerCase()
    let score = 0
    for (const t of terms) {
      if (title.includes(t)) score += 10
      const occurrences = body.split(t).length - 1
      score += Math.min(occurrences, 5)
    }
    // Whole-phrase bonus.
    if (terms.length > 1 && (title.includes(q) || body.includes(q))) score += 8
    if (score > 0) {
      results.push({
        kind: doc.kind,
        title: doc.title,
        snippet: snippetFor(doc.body, terms),
        to: doc.to,
        track: doc.track,
        score,
      })
    }
  }
  return results.sort((a, b) => b.score - a.score).slice(0, limit)
}

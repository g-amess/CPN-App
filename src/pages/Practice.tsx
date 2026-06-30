import { useMemo, useState } from 'react'
import { Info } from 'lucide-react'
import { QuizRunner } from '../components/QuizRunner'
import { practiceQuestions } from '../content/practiceQuestions'
import { shuffle } from '../lib/quiz'

type Mode = 'all' | 'mixed'

export function Practice() {
  const [mode, setMode] = useState<Mode>('all')
  const [seed, setSeed] = useState(0)

  const questions = useMemo(() => {
    if (mode === 'mixed') return shuffle(practiceQuestions)
    return practiceQuestions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, seed])

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold">Practice Questions</h1>
      <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
        <Info size={16} className="mt-0.5 shrink-0" />
        <p>
          <strong>Practice — not from the official guide.</strong> These questions were authored for this app and
          grounded in the source material to reinforce the same concepts. Each has one correct answer, three
          distractors, and an explanation.
        </p>
      </div>

      <div className="mt-4 inline-flex rounded-lg border border-stone-300 p-1 dark:border-stone-700" role="tablist">
        <button
          role="tab"
          aria-selected={mode === 'all'}
          onClick={() => { setMode('all'); setSeed((s) => s + 1) }}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${mode === 'all' ? 'bg-accent-600 text-white' : 'text-ink-soft dark:text-stone-300'}`}
        >
          All practice ({practiceQuestions.length})
        </button>
        <button
          role="tab"
          aria-selected={mode === 'mixed'}
          onClick={() => { setMode('mixed'); setSeed((s) => s + 1) }}
          className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${mode === 'mixed' ? 'bg-accent-600 text-white' : 'text-ink-soft dark:text-stone-300'}`}
        >
          Mixed (domain-weighted)
        </button>
      </div>

      <div className="mt-5">
        <QuizRunner
          key={`${mode}-${seed}`}
          questions={questions}
          kind={mode === 'mixed' ? 'mixed' : 'practice'}
          title={mode === 'mixed' ? 'Mixed Practice — Domain-Weighted' : 'All Practice Questions'}
          weighted={mode === 'mixed'}
          intro={
            mode === 'mixed'
              ? 'Questions are shuffled across domains; your final score is weighted 27/18/20/20/15 to mirror the real exam, then mapped onto the 100–1000 scaled band (pass = 720).'
              : undefined
          }
        />
      </div>
    </div>
  )
}

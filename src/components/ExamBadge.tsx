import { Link } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'
import type { ExamRef } from '../content/types'

export function ExamBadges({ refs }: { refs: ExamRef[] }) {
  if (!refs.length) return null
  return (
    <aside className="my-5 rounded-lg border border-accent-200 bg-accent-50 p-4 dark:border-accent-900 dark:bg-accent-950/40">
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-accent-800 dark:text-accent-300">
        <GraduationCap size={16} />
        Exam relevance
      </div>
      <ul className="space-y-1.5">
        {refs.map((r, i) => (
          <li key={i} className="text-sm">
            <Link
              to={`/exam/domain/${r.domainId}`}
              className="font-medium text-accent-700 underline decoration-accent-300 underline-offset-2 hover:text-accent-900 dark:text-accent-300 dark:hover:text-accent-200"
            >
              {r.label}
            </Link>
            {r.taskId && <span className="ml-1.5 font-mono text-xs text-accent-600/80 dark:text-accent-400/80">{r.taskId.replace('t', 'Task ')}</span>}
          </li>
        ))}
      </ul>
    </aside>
  )
}

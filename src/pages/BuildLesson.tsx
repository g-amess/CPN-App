import { Navigate, useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react'
import { useContent } from '../content/resolveContent'
import { Markdown } from '../components/Markdown'
import { Diagram } from '../components/Diagram'
import { CodeBlock } from '../components/CodeBlock'
import { CodeWalkthrough } from '../components/CodeWalkthrough'
import { ExamBadges } from '../components/ExamBadge'
import { KeyTakeaways, OutOfScopeBadge } from '../components/Callouts'
import { ReportIssue } from '../components/ReportIssue'
import { useProgress } from '../lib/progress'

// Lessons that get an interactive code walkthrough.
const LESSON_WALKTHROUGHS: Record<string, string[]> = {
  'implementing-multiple-turns': ['tool-use-loop', 'agentic-loop'],
  'implementing-rag-flow': ['rag-pipeline'],
  'mcp-defining-tools': ['mcp-server'],
}

export function BuildLesson() {
  const { moduleId = '', lessonId = '' } = useParams()
  const { findLesson, adjacentLessons, moduleById, buildModules, walkthroughById } = useContent()
  const lesson = findLesson(moduleId, lessonId)
  const mod = moduleById(moduleId)
  const { isLessonComplete, setLessonComplete } = useProgress()

  if (!lesson || !mod) {
    const first = buildModules[0]
    const firstLesson = first?.lessons[0]
    if (!first || !firstLesson) return <Navigate to="/" replace />
    return <Navigate to={`/build/${first.id}/${firstLesson.id}`} replace />
  }

  const done = isLessonComplete(lesson.id)
  const { prev, next } = adjacentLessons(moduleId, lessonId)
  const walkthroughs = (LESSON_WALKTHROUGHS[lesson.id] ?? []).map(walkthroughById).filter(Boolean)

  return (
    <article className="animate-fade-in">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-400">{mod.title}</p>
      <h1 className="mt-1 text-3xl font-bold">{lesson.title}</h1>
      <p className="mt-2 max-w-reading text-lg text-ink-faint">{lesson.summary}</p>

      {lesson.outOfScope && <OutOfScopeBadge note={lesson.outOfScopeNote} />}

      <div className="mt-4">
        <Markdown>{lesson.body}</Markdown>
      </div>

      {lesson.diagrams?.map((d, i) => <Diagram key={i} diagram={d} />)}

      {lesson.code && lesson.code.length > 0 && (
        <section className="mt-6 max-w-reading">
          {lesson.code.map((c, i) => (
            <CodeBlock key={i} code={c.code} lang={c.lang} title={c.title} />
          ))}
        </section>
      )}

      {walkthroughs.map((w) => (
        <CodeWalkthrough key={w!.id} walkthrough={w!} />
      ))}

      {lesson.examRelevance && <ExamBadges refs={lesson.examRelevance} />}

      <KeyTakeaways items={lesson.keyTakeaways} />

      {/* Completion toggle */}
      <div className="my-6">
        <button
          onClick={() => setLessonComplete(lesson.id, !done)}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
            done
              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'bg-accent-600 text-white hover:bg-accent-700'
          }`}
        >
          {done ? <CheckCircle2 size={17} /> : <Circle size={17} />}
          {done ? 'Completed — click to undo' : 'Mark lesson complete'}
        </button>
      </div>

      <ReportIssue context={`${mod.title} / ${lesson.title} (${moduleId}/${lessonId})`} />

      {/* Prev / next */}
      <nav className="mt-8 flex items-stretch justify-between gap-3 border-t border-stone-200 pt-5 dark:border-stone-800">
        {prev ? (
          <Link to={`/build/${prev.moduleId}/${prev.lessonId}`} className="group flex flex-1 items-center gap-2 rounded-lg border border-stone-200 p-3 hover:border-accent-400 dark:border-stone-800">
            <ChevronLeft size={18} className="shrink-0 text-ink-faint" />
            <span className="text-left">
              <span className="block text-xs text-ink-faint">Previous</span>
              <span className="text-sm font-medium">{findLesson(prev.moduleId, prev.lessonId)?.title}</span>
            </span>
          </Link>
        ) : (
          <span className="flex-1" />
        )}
        {next ? (
          <Link to={`/build/${next.moduleId}/${next.lessonId}`} className="group flex flex-1 items-center justify-end gap-2 rounded-lg border border-stone-200 p-3 text-right hover:border-accent-400 dark:border-stone-800">
            <span>
              <span className="block text-xs text-ink-faint">Next</span>
              <span className="text-sm font-medium">{findLesson(next.moduleId, next.lessonId)?.title}</span>
            </span>
            <ChevronRight size={18} className="shrink-0 text-ink-faint" />
          </Link>
        ) : (
          <span className="flex-1" />
        )}
      </nav>
    </article>
  )
}

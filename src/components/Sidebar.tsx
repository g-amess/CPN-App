import { NavLink, useLocation } from 'react-router-dom'
import { Check, Circle } from 'lucide-react'
import { useContent } from '../content/resolveContent'
import { useProgress } from '../lib/progress'

function linkClass(isActive: boolean) {
  return `block rounded-md px-3 py-1.5 text-sm transition ${
    isActive
      ? 'bg-accent-100 font-medium text-accent-900 dark:bg-accent-950/60 dark:text-accent-200'
      : 'text-ink-soft hover:bg-stone-200/70 dark:text-stone-300 dark:hover:bg-stone-800/70'
  }`
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-1 mt-4 px-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">{children}</h2>
}

function BuildNav() {
  const { isLessonComplete } = useProgress()
  const { buildModules } = useContent()
  return (
    <nav aria-label="Build track">
      {buildModules.map((m) => (
        <div key={m.id} className="mb-2">
          <SectionTitle>{m.title}</SectionTitle>
          <ul>
            {m.lessons.map((l) => (
              <li key={l.id}>
                <NavLink to={`/build/${m.id}/${l.id}`} className={({ isActive }) => linkClass(isActive)}>
                  <span className="flex items-center gap-2">
                    {isLessonComplete(l.id) ? (
                      <Check size={13} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Circle size={13} className="shrink-0 text-stone-300 dark:text-stone-600" />
                    )}
                    <span className="leading-snug">{l.title}</span>
                    {l.outOfScope && (
                      <span className="ml-auto shrink-0 rounded bg-amber-100 px-1 text-[10px] font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                        OOS
                      </span>
                    )}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

function ExamNav() {
  const { domains, scenarioSims, hasScenarios, sampleQuestions } = useContent()
  const sampleCount = sampleQuestions.length
  return (
    <nav aria-label="Exam track">
      <SectionTitle>Overview</SectionTitle>
      <ul>
        <li><NavLink to="/exam" end className={({ isActive }) => linkClass(isActive)}>Exam Overview</NavLink></li>
        <li>
          <NavLink to="/exam/quiz" className={({ isActive }) => linkClass(isActive)}>
            Official Quiz ({sampleCount})
          </NavLink>
        </li>
        <li><NavLink to="/exam/practice" className={({ isActive }) => linkClass(isActive)}>Practice Questions</NavLink></li>
        <li><NavLink to="/exam/exercises" className={({ isActive }) => linkClass(isActive)}>Preparation Exercises</NavLink></li>
        <li><NavLink to="/exam/reference" className={({ isActive }) => linkClass(isActive)}>Reference & Scope</NavLink></li>
      </ul>

      <SectionTitle>Domains</SectionTitle>
      <ul>
        {domains.map((d) => (
          <li key={d.id}>
            <NavLink to={`/exam/domain/${d.id}`} className={({ isActive }) => linkClass(isActive)}>
              <span className="flex items-center gap-2">
                <span className="leading-snug">D{d.num}: {d.title}</span>
                <span className="ml-auto shrink-0 font-mono text-[10px] text-ink-faint">{d.weight}%</span>
              </span>
            </NavLink>
          </li>
        ))}
      </ul>

      {hasScenarios && scenarioSims.length > 0 && (
        <>
          <SectionTitle>Scenario Sims</SectionTitle>
          <ul>
            {scenarioSims.map((s) => (
              <li key={s.id}>
                <NavLink to={`/exam/scenario/${s.id}`} className={({ isActive }) => linkClass(isActive)}>
                  {s.num}. {s.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </nav>
  )
}

function GeneralNav() {
  const { buildModules } = useContent()
  const first = buildModules[0]
  const firstLesson = first?.lessons[0]
  const buildTo = first && firstLesson ? `/build/${first.id}/${firstLesson.id}` : '/'
  return (
    <nav aria-label="Tools">
      <SectionTitle>Tools</SectionTitle>
      <ul>
        <li><NavLink to="/" end className={({ isActive }) => linkClass(isActive)}>Dashboard</NavLink></li>
        <li><NavLink to="/flashcards" className={({ isActive }) => linkClass(isActive)}>Flashcards</NavLink></li>
        <li><NavLink to="/concepts" className={({ isActive }) => linkClass(isActive)}>Concept Index</NavLink></li>
      </ul>
      <SectionTitle>Start learning</SectionTitle>
      <ul>
        <li><NavLink to={buildTo} className={({ isActive }) => linkClass(isActive)}>Build Track</NavLink></li>
        <li><NavLink to="/exam" className={({ isActive }) => linkClass(isActive)}>Exam Track</NavLink></li>
      </ul>
    </nav>
  )
}

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation()
  const track = pathname.startsWith('/build') ? 'build' : pathname.startsWith('/exam') ? 'exam' : 'general'

  return (
    <>
      {/* Mobile overlay */}
      {open && <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={onClose} aria-hidden />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto border-r border-stone-200 bg-stone-50 px-2 pb-10 pt-3 transition-transform dark:border-stone-800 dark:bg-stone-950 lg:static lg:z-0 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar navigation"
      >
        <div className="flex items-center justify-between px-3 lg:hidden">
          <span className="text-sm font-semibold">Navigation</span>
          <button onClick={onClose} className="rounded p-1 text-ink-faint hover:bg-stone-200 dark:hover:bg-stone-800" aria-label="Close sidebar">✕</button>
        </div>
        {track === 'build' ? <BuildNav /> : track === 'exam' ? <ExamNav /> : <GeneralNav />}
        {track !== 'general' && (
          <div className="mt-6 border-t border-stone-200 pt-3 dark:border-stone-800">
            <GeneralNav />
          </div>
        )}
      </aside>
    </>
  )
}

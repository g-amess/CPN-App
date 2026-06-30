import { useEffect } from 'react'
import { BookOpen, GraduationCap, Layers, ListChecks, X } from 'lucide-react'
import { APP_NAME } from '../lib/config'

const FEATURES = [
  { icon: BookOpen, title: 'Build Track', text: 'Lessons across foundations, prompt engineering, tool use, RAG, MCP, Claude Code, and Agent Skills — with diagrams and code.' },
  { icon: GraduationCap, title: 'Exam Track', text: 'The 5 weighted domains, the 12 official sample questions, scenario simulations, and preparation exercises.' },
  { icon: Layers, title: 'Flashcards', text: 'A spaced-repetition deck (SM-2) across both tracks, with a daily due queue and export.' },
  { icon: ListChecks, title: 'Track your readiness', text: 'Your progress, quiz history, and an exam-readiness gauge — all saved locally on this device.' },
]

export function WelcomeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onEsc)
    return () => document.removeEventListener('keydown', onEsc)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      onClick={onClose}
    >
      <div className="card w-full max-w-lg animate-fade-in p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent-600 text-base font-bold text-white">C</span>
            <h2 id="welcome-title" className="text-xl font-bold">Welcome to {APP_NAME}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-ink-faint hover:text-ink dark:hover:text-stone-200" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <p className="mt-3 text-sm text-ink-soft dark:text-stone-300">
          Two tracks in one app — the <strong>Building with the Claude API</strong> course and prep for the
          <strong> Claude Certified Architect – Foundations</strong> exam. Everything runs locally in your browser.
        </p>

        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <li key={f.title} className="rounded-lg border border-stone-200 p-3 dark:border-stone-800">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <f.icon size={16} className="text-accent-600 dark:text-accent-400" />
                {f.title}
              </div>
              <p className="mt-1 text-xs text-ink-soft dark:text-stone-300">{f.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex justify-end">
          <button type="button" onClick={onClose} className="rounded-md bg-accent-600 px-5 py-2 text-sm font-semibold text-white hover:bg-accent-700">
            Get started
          </button>
        </div>
      </div>
    </div>
  )
}

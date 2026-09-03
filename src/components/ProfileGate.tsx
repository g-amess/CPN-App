import { useState } from 'react'
import { UserPlus } from 'lucide-react'
import { useProgress, type Certification } from '../lib/progress'
import { APP_NAME } from '../lib/config'

const CERT_OPTIONS: { id: Certification; title: string; blurb: string }[] = [
  {
    id: 'architect',
    title: 'Architect Foundations',
    blurb: 'Solution architecture, Agent SDK orchestration, MCP design, and the CCAR-F exam (5 domains + scenarios).',
  },
  {
    id: 'developer',
    title: 'Developer Foundations',
    blurb: 'API integration, agents, tools/MCP, evals, and the CCDV-F exam (8 domains, 53 items).',
  },
]

/** Shown only when there is no active profile (brand-new users). Low-friction:
 *  enter a name to create a profile, or continue as Guest — with a required certification. */
export function ProfileGate() {
  const { createProfile } = useProgress()
  const [name, setName] = useState('')
  const [certification, setCertification] = useState<Certification>('architect')

  const tagline =
    certification === 'developer'
      ? 'Build with the API · Developer exam prep'
      : 'Build with the API · Architect exam prep'

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    createProfile(name, certification) // empty → "Guest"
  }

  return (
    <div className="grid min-h-screen place-items-center bg-stone-50 px-4 dark:bg-stone-950">
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-600 text-lg font-bold text-white">C</span>
          <div>
            <h1 className="text-xl font-bold">{APP_NAME}</h1>
            <p className="text-sm text-ink-faint">{tagline}</p>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-lg font-semibold">Create a profile</h2>
          <p className="mt-1 text-sm text-ink-soft dark:text-stone-300">
            Your progress is saved locally in this browser. Add a name so more than one person can use this device —
            no account, no password, nothing leaves your machine. Pick a certification — content swaps fully for that
            profile (create another profile to study both).
          </p>

          <form onSubmit={submit} className="mt-4">
            <fieldset className="mb-4">
              <legend className="text-sm font-medium">Certification</legend>
              <div className="mt-2 grid gap-2" role="radiogroup" aria-label="Certification track">
                {CERT_OPTIONS.map((opt) => {
                  const selected = certification === opt.id
                  return (
                    <label
                      key={opt.id}
                      className={`cursor-pointer rounded-md border px-3 py-2.5 transition ${
                        selected
                          ? 'border-accent-500 bg-accent-50 dark:border-accent-400 dark:bg-accent-950/40'
                          : 'border-stone-300 hover:border-stone-400 dark:border-stone-700 dark:hover:border-stone-500'
                      }`}
                    >
                      <span className="flex items-start gap-2.5">
                        <input
                          type="radio"
                          name="certification"
                          value={opt.id}
                          checked={selected}
                          onChange={() => setCertification(opt.id)}
                          className="mt-1"
                        />
                        <span>
                          <span className="block text-sm font-semibold">{opt.title}</span>
                          <span className="mt-0.5 block text-xs text-ink-soft dark:text-stone-300">{opt.blurb}</span>
                        </span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <label htmlFor="profile-name" className="text-sm font-medium">
              Display name
            </label>
            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              maxLength={40}
              placeholder="e.g. Geoff"
              className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
            />
            <div className="mt-4 flex gap-2">
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-md bg-accent-600 px-4 py-2 text-sm font-semibold text-white hover:bg-accent-700"
              >
                <UserPlus size={16} /> {name.trim() ? `Continue as ${name.trim()}` : 'Create profile'}
              </button>
              <button
                type="button"
                onClick={() => createProfile('Guest', certification)}
                className="rounded-md border border-stone-300 px-4 py-2 text-sm font-medium dark:border-stone-700"
              >
                Continue as Guest
              </button>
            </div>
          </form>
        </div>
        <p className="mt-4 text-center text-xs text-ink-faint">
          Progress is per-browser and not synced across devices. You can export/import it later for backup.
        </p>
      </div>
    </div>
  )
}

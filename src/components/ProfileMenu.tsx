import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Download, Upload, Pencil, Trash2, UserPlus, X } from 'lucide-react'
import { useProgress, type Certification } from '../lib/progress'
import { downloadFile, readFileAsText } from '../lib/exportImport'

const CERT_LABEL: Record<Certification, string> = {
  architect: 'Architect',
  developer: 'Developer',
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ProfileMenu() {
  const {
    profiles,
    activeProfile,
    createProfile,
    switchProfile,
    renameProfile,
    deleteProfile,
    exportProgress,
    importProgress,
  } = useProgress()

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'menu' | 'create' | 'rename'>('menu')
  const [name, setName] = useState('')
  const [certification, setCertification] = useState<Certification>('architect')
  const [note, setNote] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onEsc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onEsc)
    }
  }, [])

  useEffect(() => {
    if (!open) {
      setMode('menu')
      setNote(null)
      setName('')
      setCertification('architect')
    }
  }, [open])

  const onExport = () => {
    const safe = (activeProfile?.displayName ?? 'profile').replace(/[^a-z0-9]+/gi, '-').toLowerCase()
    downloadFile(`claude-mastery-${safe}.json`, exportProgress(), 'application/json')
    setNote({ kind: 'ok', text: 'Progress exported.' })
  }

  const onImportFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const text = await readFileAsText(file)
      const res = importProgress(text)
      setNote(res.ok ? { kind: 'ok', text: 'Progress imported into this profile.' } : { kind: 'err', text: res.error ?? 'Import failed.' })
    } catch {
      setNote({ kind: 'err', text: 'Could not read that file.' })
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const submitName = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === 'create') {
      if (name.trim()) {
        createProfile(name, certification)
        setOpen(false)
      }
    } else if (mode === 'rename' && activeProfile) {
      renameProfile(activeProfile.id, name)
      setMode('menu')
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-md py-1 pl-1 pr-1.5 text-sm transition hover:bg-stone-200 dark:hover:bg-stone-800"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Profile"
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-accent-600 text-xs font-semibold text-white">
          {initials(activeProfile?.displayName ?? '?')}
        </span>
        <ChevronDown size={14} className="text-ink-faint" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-72 animate-fade-in rounded-lg border border-stone-200 bg-white p-2 shadow-lg dark:border-stone-800 dark:bg-stone-900"
        >
          {mode === 'menu' && (
            <>
              <p className="px-2 pb-1 pt-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">Profiles</p>
              <ul className="max-h-56 overflow-y-auto">
                {profiles.map((p) => {
                  const active = p.id === activeProfile?.id
                  return (
                    <li key={p.id} className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => { switchProfile(p.id); setOpen(false) }}
                        className={`flex flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition ${active ? 'bg-accent-100 font-medium text-accent-900 dark:bg-accent-950/60 dark:text-accent-200' : 'hover:bg-stone-100 dark:hover:bg-stone-800'}`}
                      >
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-stone-300 text-[10px] font-semibold text-ink dark:bg-stone-700 dark:text-stone-100">
                          {initials(p.displayName)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate">{p.displayName}</span>
                          <span className="block text-[10px] font-normal text-ink-faint">{CERT_LABEL[p.certification]}</span>
                        </span>
                        {active && <Check size={14} className="shrink-0 text-accent-600 dark:text-accent-400" />}
                      </button>
                      {profiles.length > 1 && (
                        <button
                          type="button"
                          onClick={() => { if (confirm(`Delete profile "${p.displayName}" and its progress?`)) deleteProfile(p.id) }}
                          className="rounded p-1 text-ink-faint hover:text-red-600 dark:hover:text-red-400"
                          aria-label={`Delete ${p.displayName}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </li>
                  )
                })}
              </ul>

              <div className="my-1.5 border-t border-stone-200 dark:border-stone-800" />

              <button type="button" onClick={() => { setMode('create'); setName('') }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-stone-100 dark:hover:bg-stone-800">
                <UserPlus size={15} /> New profile
              </button>
              {activeProfile && (
                <button type="button" onClick={() => { setMode('rename'); setName(activeProfile.displayName) }} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-stone-100 dark:hover:bg-stone-800">
                  <Pencil size={15} /> Rename “{activeProfile.displayName}”
                </button>
              )}
              <button type="button" onClick={onExport} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-stone-100 dark:hover:bg-stone-800">
                <Download size={15} /> Export my progress
              </button>
              <button type="button" onClick={() => fileRef.current?.click()} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-stone-100 dark:hover:bg-stone-800">
                <Upload size={15} /> Import progress…
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => onImportFile(e.target.files?.[0])}
              />

              {note && (
                <p className={`mt-1.5 px-2 text-xs ${note.kind === 'ok' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  {note.text}
                </p>
              )}
            </>
          )}

          {(mode === 'create' || mode === 'rename') && (
            <form onSubmit={submitName} className="p-1">
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="pm-name" className="text-sm font-medium">{mode === 'create' ? 'New profile name' : 'Rename profile'}</label>
                <button type="button" onClick={() => setMode('menu')} className="rounded p-0.5 text-ink-faint hover:text-ink dark:hover:text-stone-200" aria-label="Back">
                  <X size={14} />
                </button>
              </div>
              <input
                id="pm-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                maxLength={40}
                placeholder="Display name"
                className="w-full rounded-md border border-stone-300 bg-white px-2 py-1.5 text-sm dark:border-stone-700 dark:bg-stone-800"
              />
              {mode === 'create' && (
                <fieldset className="mt-2">
                  <legend className="text-xs font-medium text-ink-faint">Certification</legend>
                  <div className="mt-1 flex gap-2">
                    {(['architect', 'developer'] as const).map((c) => (
                      <label
                        key={c}
                        className={`flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-xs font-medium ${
                          certification === c
                            ? 'border-accent-500 bg-accent-50 dark:border-accent-400 dark:bg-accent-950/40'
                            : 'border-stone-300 dark:border-stone-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="pm-cert"
                          className="sr-only"
                          checked={certification === c}
                          onChange={() => setCertification(c)}
                        />
                        {CERT_LABEL[c]}
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}
              <button type="submit" disabled={!name.trim()} className="mt-2 w-full rounded-md bg-accent-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-700 disabled:bg-stone-300 dark:disabled:bg-stone-700">
                {mode === 'create' ? 'Create & switch' : 'Save name'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

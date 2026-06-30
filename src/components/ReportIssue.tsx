import { useState } from 'react'
import { Flag, Check, Copy } from 'lucide-react'
import { REPORT_EMAIL } from '../lib/config'

/** Report a content issue with no backend: opens a mailto: draft, with a
 *  copy-to-clipboard fallback. No network calls. */
export function ReportIssue({ context }: { context: string }) {
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState('')
  const [copied, setCopied] = useState(false)

  const subject = `Content issue: ${context}`
  const body = `Location: ${context}\n\nIssue:\n${msg || '(describe the issue here)'}`

  const mailto = `mailto:${REPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${REPORT_EMAIL}\nSubject: ${subject}\n\n${body}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 flex items-center gap-1.5 text-xs text-ink-faint transition hover:text-accent-600 dark:hover:text-accent-400"
      >
        <Flag size={13} /> Report a content issue
      </button>
    )
  }

  return (
    <div className="mt-8 rounded-lg border border-stone-200 p-4 dark:border-stone-800">
      <p className="mb-2 text-sm font-medium">Report a content issue</p>
      <p className="mb-2 text-xs text-ink-faint">
        Re: <span className="font-mono">{context}</span>. This opens your email client — nothing is sent over the network from this app.
      </p>
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        rows={3}
        placeholder="What’s wrong or could be clearer?"
        className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm dark:border-stone-700 dark:bg-stone-900"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        <a
          href={mailto}
          className="flex items-center gap-1.5 rounded-md bg-accent-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-700"
        >
          <Flag size={14} /> Open email draft
        </a>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 rounded-md border border-stone-300 px-3 py-1.5 text-sm dark:border-stone-700"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy details'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm text-ink-faint hover:text-ink dark:hover:text-stone-200">
          Cancel
        </button>
      </div>
    </div>
  )
}

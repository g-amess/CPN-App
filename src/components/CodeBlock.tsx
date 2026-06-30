import { useState } from 'react'
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import python from 'react-syntax-highlighter/dist/esm/languages/prism/python'
import javascript from 'react-syntax-highlighter/dist/esm/languages/prism/javascript'
import json from 'react-syntax-highlighter/dist/esm/languages/prism/json'
import bash from 'react-syntax-highlighter/dist/esm/languages/prism/bash'
import markdown from 'react-syntax-highlighter/dist/esm/languages/prism/markdown'
import { oneLight, oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Check, Copy } from 'lucide-react'
import { useProgress } from '../lib/progress'

// Register only the languages used in the content to keep the bundle lean.
SyntaxHighlighter.registerLanguage('python', python)
SyntaxHighlighter.registerLanguage('javascript', javascript)
SyntaxHighlighter.registerLanguage('json', json)
SyntaxHighlighter.registerLanguage('bash', bash)
SyntaxHighlighter.registerLanguage('markdown', markdown)

export function CodeBlock({ code, lang, title }: { code: string; lang?: string; title?: string }) {
  const { store } = useProgress()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="my-4 overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800">
      <div className="flex items-center justify-between border-b border-stone-200 bg-stone-100 px-3 py-1.5 dark:border-stone-800 dark:bg-stone-900">
        <span className="font-mono text-xs text-ink-faint">{title ?? lang ?? 'code'}</span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-ink-faint transition hover:text-ink dark:hover:text-stone-200"
          aria-label="Copy code"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={lang ?? 'text'}
        style={store.theme === 'dark' ? oneDark : oneLight}
        customStyle={{ margin: 0, background: 'transparent', fontSize: '0.82rem', padding: '0.9rem 1rem' }}
        codeTagProps={{ style: { fontFamily: 'JetBrains Mono, ui-monospace, monospace' } }}
        wrapLongLines={false}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}

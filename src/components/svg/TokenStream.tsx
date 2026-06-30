import { useEffect, useState } from 'react'

// Bespoke animated visual: text generated one token at a time.
// Respects prefers-reduced-motion (shows the full stream immediately).

const TOKENS = ['Claude', ' gen', 'er', 'ates', ' text', ' one', ' token', ' at', ' a', ' time', '.']

export function TokenStream() {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [count, setCount] = useState(reduced ? TOKENS.length : 0)

  useEffect(() => {
    if (reduced) return
    if (count >= TOKENS.length) {
      const reset = setTimeout(() => setCount(0), 1800)
      return () => clearTimeout(reset)
    }
    const t = setTimeout(() => setCount((c) => c + 1), 320)
    return () => clearTimeout(t)
  }, [count, reduced])

  return (
    <figure className="my-2">
      <div className="card flex min-h-[3.5rem] flex-wrap items-center gap-1 p-3 font-mono text-sm">
        {TOKENS.slice(0, count).map((tok, i) => (
          <span
            key={i}
            className="animate-fade-in rounded bg-accent-100 px-1 py-0.5 text-accent-800 dark:bg-accent-900/50 dark:text-accent-200"
          >
            {tok === ' ' || tok.startsWith(' ') ? ' ' + tok.trimStart() : tok}
          </span>
        ))}
        {count < TOKENS.length && <span className="ml-0.5 animate-pulse text-accent-500">▌</span>}
      </div>
      <figcaption className="mt-1 text-xs text-ink-faint">
        The model predicts the next token, appends it, and repeats — the loop behind every response.
      </figcaption>
    </figure>
  )
}

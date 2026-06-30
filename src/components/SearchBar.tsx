import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'

export function SearchBar() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep the field in sync when already on the search page.
  useEffect(() => {
    const current = params.get('q')
    if (current !== null) setQ(current)
  }, [params])

  // Cmd/Ctrl-K focuses the search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        if (q.trim().length >= 2) navigate(`/search?q=${encodeURIComponent(q.trim())}`)
      }}
      className="relative flex-1 sm:max-w-xs"
    >
      <Search size={16} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
      <input
        ref={inputRef}
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search lessons, concepts… (⌘K)"
        aria-label="Search"
        className="w-full rounded-md border border-stone-300 bg-white py-1.5 pl-8 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-accent-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
      />
    </form>
  )
}

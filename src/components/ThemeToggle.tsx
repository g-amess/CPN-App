import { Moon, Sun } from 'lucide-react'
import { useProgress } from '../lib/progress'

export function ThemeToggle() {
  const { store, toggleTheme } = useProgress()
  const dark = store.theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-md p-2 text-ink-soft transition hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-800"
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}

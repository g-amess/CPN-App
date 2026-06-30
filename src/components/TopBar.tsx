import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, BookOpen, GraduationCap, Library, LayoutDashboard, HelpCircle } from 'lucide-react'
import { SearchBar } from './SearchBar'
import { ThemeToggle } from './ThemeToggle'
import { ProfileMenu } from './ProfileMenu'
import { buildModules } from '../content/buildTrack'

const firstLessonPath = `/build/${buildModules[0].id}/${buildModules[0].lessons[0].id}`

export function TopBar({ onToggleSidebar, onOpenHelp }: { onToggleSidebar: () => void; onOpenHelp: () => void }) {
  const { pathname } = useLocation()
  const track: 'build' | 'exam' | null = pathname.startsWith('/build')
    ? 'build'
    : pathname.startsWith('/exam')
    ? 'exam'
    : null

  const trackBtn = (active: boolean) =>
    `flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
      active
        ? 'bg-accent-600 text-white'
        : 'text-ink-soft hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-800'
    }`

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-stone-50/90 backdrop-blur dark:border-stone-800 dark:bg-stone-950/90">
      <div className="flex items-center gap-2 px-3 py-2 sm:px-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="rounded-md p-2 text-ink-soft hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-800 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        <Link to="/" className="mr-1 flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-accent-600 text-white">C</span>
          <span className="hidden text-ink dark:text-stone-100 sm:inline">Claude Mastery</span>
        </Link>

        <nav className="ml-1 flex items-center gap-1" aria-label="Tracks">
          <Link to={firstLessonPath} className={trackBtn(track === 'build')}>
            <BookOpen size={15} /> Build
          </Link>
          <Link to="/exam" className={trackBtn(track === 'exam')}>
            <GraduationCap size={15} /> Exam
          </Link>
        </nav>

        <div className="ml-auto flex flex-1 items-center justify-end gap-1.5">
          <SearchBar />
          <NavLink
            to="/concepts"
            className={({ isActive }) =>
              `hidden rounded-md p-2 transition sm:block ${
                isActive ? 'text-accent-600' : 'text-ink-soft hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-800'
              }`
            }
            aria-label="Concept index"
            title="Concept index"
          >
            <Library size={18} />
          </NavLink>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `hidden rounded-md p-2 transition sm:block ${
                isActive ? 'text-accent-600' : 'text-ink-soft hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-800'
              }`
            }
            aria-label="Dashboard"
            title="Dashboard"
          >
            <LayoutDashboard size={18} />
          </NavLink>
          <button
            type="button"
            onClick={onOpenHelp}
            className="hidden rounded-md p-2 text-ink-soft transition hover:bg-stone-200 dark:text-stone-300 dark:hover:bg-stone-800 sm:block"
            aria-label="About this app"
            title="About this app"
          >
            <HelpCircle size={18} />
          </button>
          <ThemeToggle />
          <ProfileMenu />
        </div>
      </div>
    </header>
  )
}

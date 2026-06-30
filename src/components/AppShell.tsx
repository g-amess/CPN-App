import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { WelcomeModal } from './WelcomeModal'
import { useProgress } from '../lib/progress'

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const { pathname, search } = useLocation()
  const { setLastVisited, onboardingSeen, markOnboardingSeen } = useProgress()

  // Close the mobile sidebar and scroll to top on navigation; persist location.
  useEffect(() => {
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'auto' })
    setLastVisited(pathname + search)
  }, [pathname, search, setLastVisited])

  // First-run onboarding for this profile.
  useEffect(() => {
    if (!onboardingSeen) setWelcomeOpen(true)
  }, [onboardingSeen])

  const closeWelcome = () => {
    setWelcomeOpen(false)
    if (!onboardingSeen) markOnboardingSeen()
  }

  return (
    <div className="min-h-screen">
      <TopBar onToggleSidebar={() => setSidebarOpen((v) => !v)} onOpenHelp={() => setWelcomeOpen(true)} />
      <WelcomeModal open={welcomeOpen} onClose={closeWelcome} />
      <div className="mx-auto flex max-w-[1400px]">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8" id="main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

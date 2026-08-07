import { Routes, Route, Navigate } from 'react-router-dom'
import { ProgressProvider, useProgress } from './lib/progress'
import { AppShell } from './components/AppShell'
import { ProfileGate } from './components/ProfileGate'
import { useContent } from './content/resolveContent'
import { Dashboard } from './pages/Dashboard'
import { BuildLesson } from './pages/BuildLesson'
import { ExamOverview } from './pages/ExamOverview'
import { DomainPage } from './pages/Domain'
import { OfficialQuiz } from './pages/OfficialQuiz'
import { Practice } from './pages/Practice'
import { ScenarioPage } from './pages/Scenario'
import { Exercises } from './pages/Exercises'
import { Reference } from './pages/Reference'
import { Flashcards } from './pages/Flashcards'
import { Concepts } from './pages/Concepts'
import { SearchPage } from './pages/SearchPage'

function FirstBuildRedirect() {
  const { buildModules } = useContent()
  const first = buildModules[0]
  const lesson = first?.lessons[0]
  if (!first || !lesson) return <Navigate to="/" replace />
  return <Navigate to={`/build/${first.id}/${lesson.id}`} replace />
}

function ScenarioGate() {
  const { hasScenarios } = useContent()
  if (!hasScenarios) return <Navigate to="/exam" replace />
  return <ScenarioPage />
}

function Gated() {
  const { hasActiveProfile } = useProgress()
  if (!hasActiveProfile) return <ProfileGate />
  return (
    <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="build" element={<FirstBuildRedirect />} />
          <Route path="build/:moduleId/:lessonId" element={<BuildLesson />} />
          <Route path="exam" element={<ExamOverview />} />
          <Route path="exam/domain/:domainId" element={<DomainPage />} />
          <Route path="exam/quiz" element={<OfficialQuiz />} />
          <Route path="exam/practice" element={<Practice />} />
          <Route path="exam/scenario/:scenarioId" element={<ScenarioGate />} />
          <Route path="exam/exercises" element={<Exercises />} />
          <Route path="exam/reference" element={<Reference />} />
          <Route path="flashcards" element={<Flashcards />} />
          <Route path="concepts" element={<Concepts />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <Gated />
    </ProgressProvider>
  )
}

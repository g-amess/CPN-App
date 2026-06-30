// Shared content + domain types for both tracks.

export type TrackId = 'build' | 'exam'

export type OptionKey = 'A' | 'B' | 'C' | 'D'

export interface CodeSnippet {
  lang: string
  title?: string
  code: string
}

export type DiagramKind = 'mermaid' | 'temperature' | 'embedding' | 'tokenstream'

export interface DiagramRef {
  kind: DiagramKind
  title?: string
  caption?: string
  /** Mermaid source — required when kind === 'mermaid'. */
  code?: string
}

export interface ExamRef {
  domainId: string
  taskId?: string
  label: string
}

// ---- Build track ----

export interface Lesson {
  id: string
  moduleId: string
  title: string
  /** One-sentence summary used in lists and search snippets. */
  summary: string
  /** Markdown lesson body (authored teaching prose grounded in the sources). */
  body: string
  keyTakeaways: string[]
  diagrams?: DiagramRef[]
  code?: CodeSnippet[]
  examRelevance?: ExamRef[]
  /** True for topics the notes teach but the exam excludes. */
  outOfScope?: boolean
  outOfScopeNote?: string
}

export interface BuildModule {
  id: string
  title: string
  blurb: string
  lessons: Lesson[]
}

// ---- Exam track ----

export interface TaskStatement {
  id: string
  title: string
  knowledge: string[]
  skills: string[]
  /** Authored bridging explanation, especially for exam-only gaps. */
  explanation: string
  buildLinks?: { moduleId: string; lessonId: string; label: string }[]
}

export interface Domain {
  id: string
  num: number
  title: string
  weight: number
  blurb: string
  tasks: TaskStatement[]
}

export interface ExamScenario {
  id: string
  num: number
  title: string
  context: string
  primaryDomains: string[]
}

export interface Exercise {
  id: string
  num: number
  title: string
  objective: string
  steps: string[]
  domains: string[]
}

// ---- Quizzes ----

export interface Question {
  id: string
  question: string
  options: { key: OptionKey; text: string }[]
  correct: OptionKey
  explanation: string
  /** Domain id this question primarily maps to (for weighted scoring). */
  domainId: string
  scenarioTitle?: string
}

export interface SampleQuestion extends Question {
  source: 'official'
}

export interface PracticeQuestion extends Question {
  source: 'practice'
  track: TrackId
}

// ---- Scenario simulations ----

export interface Decision {
  id: string
  prompt: string
  options: { key: OptionKey; text: string }[]
  correct: OptionKey
  /** Markdown reasoning revealed after answering. */
  reveal: string
  fromOfficialQuestion?: string
}

export interface ScenarioSim {
  id: string
  num: number
  title: string
  context: string
  primaryDomains: string[]
  decisions: Decision[]
}

// ---- Code walkthroughs ----

export interface WalkthroughStep {
  code: string
  lang: string
  commentary: string
}

export interface Walkthrough {
  id: string
  title: string
  intro: string
  steps: WalkthroughStep[]
}

// ---- Flashcards ----

export interface Flashcard {
  id: string
  term: string
  def: string
  track: TrackId
  /** Module id (build) or domain id (exam). */
  group: string
  groupLabel: string
}

// ---- Concept index ----

export interface ConceptEntry {
  term: string
  blurb: string
  links: { label: string; to: string }[]
}

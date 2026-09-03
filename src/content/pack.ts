import type {
  BuildModule,
  Certification,
  ConceptEntry,
  Domain,
  Exercise,
  ExamScenario,
  Flashcard,
  Lesson,
  PracticeQuestion,
  SampleQuestion,
  ScenarioSim,
  Walkthrough,
} from './types'

export interface ExamMeta {
  title: string
  format: string
  scoring: string
  scenarioNote: string
  version: string
  /** Item count shown in chrome (e.g. official sample quiz size). */
  sampleCount?: number
  itemCount?: number
  timeLimitMinutes?: number
  examCode?: string
}

export interface ReferenceAppendix {
  technologies: { name: string; detail: string }[]
  inScope: string[]
  outOfScope: string[]
}

export interface ContentPack {
  certification: Certification
  label: string
  tagline: string
  examShortName: string
  hasScenarios: boolean
  buildModules: BuildModule[]
  allLessons: Lesson[]
  totalLessons: number
  findLesson: (moduleId: string, lessonId: string) => Lesson | undefined
  adjacentLessons: (
    moduleId: string,
    lessonId: string,
  ) => { prev?: { moduleId: string; lessonId: string }; next?: { moduleId: string; lessonId: string } }
  moduleById: (moduleId: string) => BuildModule | undefined
  lessonById: (lessonId: string) => Lesson | undefined
  domains: Domain[]
  examMeta: ExamMeta
  examScenarios: ExamScenario[]
  exercises: Exercise[]
  reference: ReferenceAppendix
  sampleQuestions: SampleQuestion[]
  practiceQuestions: PracticeQuestion[]
  flashcards: Flashcard[]
  conceptIndex: ConceptEntry[]
  scenarioSims: ScenarioSim[]
  scenarioById: (id: string) => ScenarioSim | undefined
  walkthroughs: Walkthrough[]
  walkthroughById: (id: string) => Walkthrough | undefined
}

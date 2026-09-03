import type { ContentPack } from '../pack'
import { buildModules, findLesson, adjacentLessons, moduleById, lessonById, totalLessons, allLessons } from './buildTrack'
import { domains, examMeta, examScenarios, exercises, reference } from './examTrack'
import { sampleQuestions } from './sampleQuestions'
import { practiceQuestions } from './practiceQuestions'
import { flashcards } from './flashcards'
import { conceptIndex } from './conceptIndex'
import { scenarioSims, scenarioById } from './scenarios'
import { walkthroughs, walkthroughById } from './codeWalkthroughs'

export const architectPack: ContentPack = {
  certification: 'architect',
  label: 'Architect Foundations',
  tagline: 'Build with the API · Architect exam prep',
  examShortName: 'Architect',
  hasScenarios: true,
  buildModules,
  allLessons,
  totalLessons,
  findLesson,
  adjacentLessons,
  moduleById,
  lessonById,
  domains,
  examMeta: { ...examMeta, sampleCount: sampleQuestions.length, itemCount: 60, timeLimitMinutes: 120, examCode: 'CCAR-F' },
  examScenarios,
  exercises,
  reference,
  sampleQuestions,
  practiceQuestions,
  flashcards,
  conceptIndex,
  scenarioSims,
  scenarioById,
  walkthroughs,
  walkthroughById,
}

import type { BuildModule, Lesson } from './types'
import { m1 } from './modules/m1-foundations'
import { m2 } from './modules/m2-prompt-eval'
import { m3 } from './modules/m3-tool-use'
import { m4 } from './modules/m4-rag'
import { m5 } from './modules/m5-advanced'
import { m6 } from './modules/m6-mcp'
import { m7 } from './modules/m7-claude-code'
import { m8 } from './modules/m8-agent-skills'

export const buildModules: BuildModule[] = [m1, m2, m3, m4, m5, m6, m7, m8]

export const allLessons: Lesson[] = buildModules.flatMap((m) => m.lessons)

export const totalLessons = allLessons.length

export function findLesson(moduleId: string, lessonId: string): Lesson | undefined {
  return buildModules.find((m) => m.id === moduleId)?.lessons.find((l) => l.id === lessonId)
}

export function lessonById(lessonId: string): Lesson | undefined {
  return allLessons.find((l) => l.id === lessonId)
}

export function moduleById(moduleId: string): BuildModule | undefined {
  return buildModules.find((m) => m.id === moduleId)
}

/** Flat ordered list of {moduleId, lessonId} for prev/next navigation. */
export const lessonOrder = buildModules.flatMap((m) => m.lessons.map((l) => ({ moduleId: m.id, lessonId: l.id })))

export function adjacentLessons(moduleId: string, lessonId: string) {
  const i = lessonOrder.findIndex((x) => x.moduleId === moduleId && x.lessonId === lessonId)
  return {
    prev: i > 0 ? lessonOrder[i - 1] : undefined,
    next: i >= 0 && i < lessonOrder.length - 1 ? lessonOrder[i + 1] : undefined,
  }
}

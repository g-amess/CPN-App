import type { BuildModule, Lesson } from '../types'
import { m1 } from './modules/m1-mso-foundations'
import { m2 } from './modules/m2-prompting-agents-tool-use'
import { m3 } from './modules/m3-claude-code-mcp'
import { m4 } from './modules/m4-production-evals-security'
import { m5 } from './modules/m5-accelerators-ip'

export const buildModules: BuildModule[] = [m1, m2, m3, m4, m5]

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

export const lessonOrder = buildModules.flatMap((m) =>
  m.lessons.map((l) => ({ moduleId: m.id, lessonId: l.id })),
)

export function adjacentLessons(moduleId: string, lessonId: string) {
  const i = lessonOrder.findIndex((x) => x.moduleId === moduleId && x.lessonId === lessonId)
  return {
    prev: i > 0 ? lessonOrder[i - 1] : undefined,
    next: i >= 0 && i < lessonOrder.length - 1 ? lessonOrder[i + 1] : undefined,
  }
}

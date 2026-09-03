import { createContext, useContext, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { freshCard, schedule, type CardState, type Grade } from './srs'
import type { Certification } from '../content/types'

export interface QuizAttempt {
  id: string
  kind: 'official' | 'practice' | 'mixed'
  date: number
  total: number
  correct: number
  perDomain: Record<string, { correct: number; total: number }>
  /** Domain-weighted scaled-style score (0–100) for mixed mode. */
  weightedPct?: number
}

export type Theme = 'light' | 'dark'

export type { Certification }

export interface Profile {
  id: string
  displayName: string
  createdAt: number
  /** Which certification content pack this profile studies. Defaults to architect for migrated profiles. */
  certification: Certification
}

/** Per-profile progress. `theme` is composed in for backwards-compatible reads
 *  but is actually stored device-globally (see THEME_KEY). */
interface ProfileStore {
  lessonsCompleted: string[]
  flashcards: Record<string, CardState>
  quizHistory: QuizAttempt[]
  lastVisited: string
  onboardingSeen: boolean
}

/** Public store shape — unchanged for existing readers (store.theme, store.lessonsCompleted, …). */
export interface Store extends ProfileStore {
  theme: Theme
}

interface ProfilesRegistry {
  activeId: string
  profiles: Profile[]
  migratedFromV1?: boolean
}

// ---- storage keys ----
const PROFILES_KEY = 'cma:profiles'
const THEME_KEY = 'cma:theme'
const LEGACY_KEY = 'claude-mastery:v1'
const profileKey = (id: string) => `cma:profile:${id}`

// ---- low-level helpers ----
function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw === null ? null : (JSON.parse(raw) as T)
  } catch {
    return null
  }
}
function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full/unavailable */
  }
}
function genId(): string {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch {
    /* fall through */
  }
  return `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

function emptyStore(): ProfileStore {
  return { lessonsCompleted: [], flashcards: {}, quizHistory: [], lastVisited: '/', onboardingSeen: false }
}

function readProfileStore(id: string): ProfileStore {
  const s = readJSON<Partial<ProfileStore>>(profileKey(id))
  return { ...emptyStore(), ...(s ?? {}) }
}
function writeProfileStore(id: string, store: ProfileStore) {
  writeJSON(profileKey(id), store)
}

function normalizeCertification(value: unknown): Certification {
  return value === 'developer' ? 'developer' : 'architect'
}

/** Ensure every profile has a certification (existing profiles → architect). */
function migrateRegistry(reg: ProfilesRegistry): ProfilesRegistry {
  let changed = false
  const profiles = reg.profiles.map((p) => {
    const raw = p as Profile & { certification?: Certification }
    if (raw.certification === 'architect' || raw.certification === 'developer') return raw as Profile
    changed = true
    return { ...raw, certification: 'architect' as const }
  })
  if (!changed) return reg
  const next = { ...reg, profiles }
  writeJSON(PROFILES_KEY, next)
  return next
}

/** Run once: load the registry, or create it — migrating legacy v1 data into a default profile. */
function initRegistry(): ProfilesRegistry {
  const existing = readJSON<ProfilesRegistry>(PROFILES_KEY)
  if (existing && Array.isArray(existing.profiles)) return migrateRegistry(existing)

  const legacy = readJSON<Record<string, unknown>>(LEGACY_KEY)
  if (legacy) {
    // Returning v2 user — migrate their single bucket into a default "You" profile.
    const id = genId()
    writeProfileStore(id, {
      ...emptyStore(),
      lessonsCompleted: (legacy.lessonsCompleted as string[]) ?? [],
      flashcards: (legacy.flashcards as ProfileStore['flashcards']) ?? {},
      quizHistory: (legacy.quizHistory as QuizAttempt[]) ?? [],
      lastVisited: (legacy.lastVisited as string) ?? '/',
      onboardingSeen: true, // don't replay onboarding for an existing user
    })
    if (readJSON<Theme>(THEME_KEY) === null && (legacy.theme === 'light' || legacy.theme === 'dark')) {
      writeJSON(THEME_KEY, legacy.theme)
    }
    const reg: ProfilesRegistry = {
      activeId: id,
      profiles: [{ id, displayName: 'You', createdAt: Date.now(), certification: 'architect' }],
      migratedFromV1: true,
    }
    writeJSON(PROFILES_KEY, reg)
    return reg
  }

  // Brand-new user — no active profile yet, so the ProfileGate is shown.
  const reg: ProfilesRegistry = { activeId: '', profiles: [] }
  writeJSON(PROFILES_KEY, reg)
  return reg
}

function defaultTheme(): Theme {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export interface ImportResult {
  ok: boolean
  error?: string
}

interface ProgressApi {
  store: Store
  // theme
  toggleTheme: () => void
  setTheme: (t: Theme) => void
  // lessons
  isLessonComplete: (id: string) => boolean
  setLessonComplete: (id: string, done: boolean) => void
  // flashcards
  cardState: (id: string) => CardState
  gradeCard: (id: string, grade: Grade) => void
  // quizzes
  recordQuiz: (attempt: QuizAttempt) => void
  // misc
  setLastVisited: (path: string) => void
  resetAll: () => void
  // onboarding
  onboardingSeen: boolean
  markOnboardingSeen: () => void
  // profiles
  profiles: Profile[]
  activeProfile: Profile | undefined
  hasActiveProfile: boolean
  createProfile: (name: string, certification: Certification) => string
  switchProfile: (id: string) => void
  renameProfile: (id: string, name: string) => void
  deleteProfile: (id: string) => void
  // portability
  exportProgress: () => string
  importProgress: (json: string) => ImportResult
}

const Ctx = createContext<ProgressApi | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  // Registry first, so any legacy→THEME_KEY migration happens before the theme hook reads it.
  const [registry, setRegistryState] = useState<ProfilesRegistry>(initRegistry)
  const [theme, setThemeStored] = useLocalStorage<Theme>(THEME_KEY, defaultTheme())
  const activeId = registry.activeId

  // Per-profile data managed manually (NOT via useLocalStorage with a dynamic key,
  // which would clobber on switch). A ref keeps writes pinned to the current profile.
  const activeIdRef = useRef(activeId)
  activeIdRef.current = activeId

  const [profileStore, setProfileStoreState] = useState<ProfileStore>(() =>
    activeId ? readProfileStore(activeId) : emptyStore(),
  )

  // Reload the dataset when the active profile changes (no write on load → no clobber).
  useEffect(() => {
    setProfileStoreState(activeId ? readProfileStore(activeId) : emptyStore())
  }, [activeId])

  const applyTheme = useCallback((t: Theme) => {
    document.documentElement.classList.toggle('dark', t === 'dark')
  }, [])
  useEffect(() => applyTheme(theme), [theme, applyTheme])

  const setRegistry = useCallback((next: ProfilesRegistry) => {
    writeJSON(PROFILES_KEY, next)
    setRegistryState(next)
  }, [])

  // Mutate the active profile's store and persist immediately to the right key.
  const setStore = useCallback((updater: (prev: ProfileStore) => ProfileStore) => {
    setProfileStoreState((prev) => {
      const next = updater(prev)
      if (activeIdRef.current) writeProfileStore(activeIdRef.current, next)
      return next
    })
  }, [])

  // ---- theme ----
  const setTheme = useCallback((t: Theme) => { applyTheme(t); setThemeStored(t) }, [applyTheme, setThemeStored])
  const toggleTheme = useCallback(() => setThemeStored((t) => (t === 'dark' ? 'light' : 'dark')), [setThemeStored])

  // ---- lessons ----
  const isLessonComplete = useCallback((id: string) => profileStore.lessonsCompleted.includes(id), [profileStore])
  const setLessonComplete = useCallback(
    (id: string, done: boolean) => {
      setStore((s) => {
        const set = new Set(s.lessonsCompleted)
        if (done) set.add(id)
        else set.delete(id)
        return { ...s, lessonsCompleted: [...set] }
      })
    },
    [setStore],
  )

  // ---- flashcards ----
  const cardState = useCallback((id: string) => profileStore.flashcards[id] ?? freshCard(), [profileStore])
  const gradeCard = useCallback(
    (id: string, grade: Grade) => {
      const now = Date.now()
      setStore((s) => ({ ...s, flashcards: { ...s.flashcards, [id]: schedule(s.flashcards[id] ?? freshCard(), grade, now) } }))
    },
    [setStore],
  )

  // ---- quizzes ----
  const recordQuiz = useCallback(
    (attempt: QuizAttempt) => setStore((s) => ({ ...s, quizHistory: [attempt, ...s.quizHistory].slice(0, 100) })),
    [setStore],
  )

  const setLastVisited = useCallback(
    (path: string) => setStore((s) => (s.lastVisited === path ? s : { ...s, lastVisited: path })),
    [setStore],
  )

  const resetAll = useCallback(
    () => setStore((s) => ({ ...emptyStore(), onboardingSeen: s.onboardingSeen })),
    [setStore],
  )

  // ---- onboarding ----
  const markOnboardingSeen = useCallback(() => setStore((s) => ({ ...s, onboardingSeen: true })), [setStore])

  // ---- profiles ----
  const createProfile = useCallback(
    (name: string, certification: Certification) => {
      const id = genId()
      const displayName = name.trim() || 'Guest'
      writeProfileStore(id, emptyStore())
      setRegistry({
        ...registry,
        profiles: [
          ...registry.profiles,
          { id, displayName, createdAt: Date.now(), certification: normalizeCertification(certification) },
        ],
        activeId: id,
      })
      return id
    },
    [registry, setRegistry],
  )
  const switchProfile = useCallback(
    (id: string) => {
      if (id === registry.activeId) return
      if (!registry.profiles.some((p) => p.id === id)) return
      setRegistry({ ...registry, activeId: id })
    },
    [registry, setRegistry],
  )
  const renameProfile = useCallback(
    (id: string, name: string) => {
      const displayName = name.trim()
      if (!displayName) return
      setRegistry({ ...registry, profiles: registry.profiles.map((p) => (p.id === id ? { ...p, displayName } : p)) })
    },
    [registry, setRegistry],
  )
  const deleteProfile = useCallback(
    (id: string) => {
      try {
        localStorage.removeItem(profileKey(id))
      } catch {
        /* ignore */
      }
      const remaining = registry.profiles.filter((p) => p.id !== id)
      const nextActive = registry.activeId === id ? (remaining[0]?.id ?? '') : registry.activeId
      setRegistry({ ...registry, profiles: remaining, activeId: nextActive })
    },
    [registry, setRegistry],
  )

  // ---- portability ----
  const exportProgress = useCallback(() => {
    const active = registry.profiles.find((p) => p.id === activeId)
    return JSON.stringify(
      {
        kind: 'cma-progress',
        version: 2,
        exportedAt: Date.now(),
        profileName: active?.displayName ?? 'Profile',
        certification: active?.certification ?? 'architect',
        data: profileStore,
      },
      null,
      2,
    )
  }, [registry, activeId, profileStore])

  const importProgress = useCallback(
    (json: string): ImportResult => {
      let parsed: unknown
      try {
        parsed = JSON.parse(json)
      } catch {
        return { ok: false, error: 'That file is not valid JSON.' }
      }
      const obj = parsed as { kind?: string; certification?: unknown; data?: Partial<ProfileStore> }
      const data = obj && typeof obj === 'object' ? obj.data : undefined
      if (!data || typeof data !== 'object') return { ok: false, error: 'Unrecognized file — missing progress data.' }
      if (!Array.isArray(data.lessonsCompleted) || typeof data.flashcards !== 'object' || !Array.isArray(data.quizHistory)) {
        return { ok: false, error: 'File contents do not look like exported progress.' }
      }
      if (!activeIdRef.current) return { ok: false, error: 'Select or create a profile before importing.' }
      setStore(() => ({ ...emptyStore(), ...data, onboardingSeen: true }))
      if (obj.certification === 'architect' || obj.certification === 'developer') {
        const id = activeIdRef.current
        setRegistryState((prev) => {
          const next = {
            ...prev,
            profiles: prev.profiles.map((p) =>
              p.id === id ? { ...p, certification: normalizeCertification(obj.certification) } : p,
            ),
          }
          writeJSON(PROFILES_KEY, next)
          return next
        })
      }
      return { ok: true }
    },
    [setStore],
  )

  const store: Store = { ...profileStore, theme }

  const api: ProgressApi = {
    store,
    toggleTheme,
    setTheme,
    isLessonComplete,
    setLessonComplete,
    cardState,
    gradeCard,
    recordQuiz,
    setLastVisited,
    resetAll,
    onboardingSeen: profileStore.onboardingSeen,
    markOnboardingSeen,
    profiles: registry.profiles,
    activeProfile: registry.profiles.find((p) => p.id === activeId),
    hasActiveProfile: !!activeId && registry.profiles.some((p) => p.id === activeId),
    createProfile,
    switchProfile,
    renameProfile,
    deleteProfile,
    exportProgress,
    importProgress,
  }

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

export function useProgress(): ProgressApi {
  const v = useContext(Ctx)
  if (!v) throw new Error('useProgress must be used within ProgressProvider')
  return v
}

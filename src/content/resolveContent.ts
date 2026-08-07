import { useMemo } from 'react'
import type { Certification } from './types'
import type { ContentPack } from './pack'
import { architectPack } from './architect'
import { developerPack } from './developer'
import { useProgress } from '../lib/progress'

export type { ContentPack, ExamMeta, ReferenceAppendix } from './pack'

const packs: Record<Certification, ContentPack> = {
  architect: architectPack,
  developer: developerPack,
}

export function resolveContent(certification: Certification | undefined | null): ContentPack {
  return packs[certification === 'developer' ? 'developer' : 'architect']
}

/** Active content pack for the signed-in profile's certification. */
export function useContent(): ContentPack {
  const { activeProfile } = useProgress()
  return useMemo(() => resolveContent(activeProfile?.certification), [activeProfile?.certification])
}

export function useCertification(): Certification {
  const { activeProfile } = useProgress()
  return activeProfile?.certification === 'developer' ? 'developer' : 'architect'
}

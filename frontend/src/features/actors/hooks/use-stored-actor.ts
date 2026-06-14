import { useState } from 'react'
import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import { getJSON } from '@/shared/utils/safe-local-storage'
import type { ActorCardData } from '../types/actor'

export function useStoredActor(): ActorCardData | null {
  const [actor] = useState<ActorCardData | null>(() =>
    getJSON<ActorCardData>(STORAGE_KEYS.selectedActor)
  )
  return actor
}

import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import { getJSON, setJSON } from '@/shared/utils/safe-local-storage'
import { FALLBACK_ACTORS } from '../constants/fallback-actors'
import type { ActorCardData } from '../types/actor'

export function ensureDefaultActor(): void {
  if (typeof window === 'undefined') return
  if (getJSON<ActorCardData>(STORAGE_KEYS.selectedActor)) return
  const fallback = FALLBACK_ACTORS[0]
  if (fallback) {
    setJSON(STORAGE_KEYS.selectedActor, fallback)
  }
}

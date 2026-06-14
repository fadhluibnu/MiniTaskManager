import { useCallback, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEYS } from '@/shared/constants/storage-keys'
import { getJSON, removeItem, setJSON } from '@/shared/utils/safe-local-storage'
import type { ActorCardData } from '../types/actor'

interface UseSelectedActorResult {
  selectedActor: ActorCardData | null
  selectActor: (actor: ActorCardData) => void
  clearSelection: () => void
}

export function useSelectedActor(availableActors: ActorCardData[]): UseSelectedActorResult {
  const [storedSelection, setStoredSelection] = useState<ActorCardData | null>(() =>
    getJSON<ActorCardData>(STORAGE_KEYS.selectedActor)
  )

  const selectedActor = useMemo<ActorCardData | null>(() => {
    if (!storedSelection) return null
    return availableActors.find((actor) => actor.id === storedSelection.id) ?? null
  }, [storedSelection, availableActors])

  useEffect(() => {
    if (!storedSelection) return
    const exists = availableActors.some((actor) => actor.id === storedSelection.id)
    if (!exists) {
      queueMicrotask(() => {
        removeItem(STORAGE_KEYS.selectedActor)
        setStoredSelection(null)
      })
    }
  }, [availableActors, storedSelection])

  const selectActor = useCallback((actor: ActorCardData) => {
    setStoredSelection(actor)
    setJSON(STORAGE_KEYS.selectedActor, actor)
  }, [])

  const clearSelection = useCallback(() => {
    setStoredSelection(null)
    removeItem(STORAGE_KEYS.selectedActor)
  }, [])

  return { selectedActor, selectActor, clearSelection }
}

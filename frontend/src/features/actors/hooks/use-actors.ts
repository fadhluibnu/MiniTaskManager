import { useEffect, useState } from 'react'
import { FALLBACK_ACTORS } from '../constants/fallback-actors'
import type { ActorCardData } from '../types/actor'

interface UseActorsResult {
  actors: ActorCardData[]
  isLoading: boolean
  isUsingFallback: boolean
}

export function useActors(): UseActorsResult {
  const [actors, setActors] = useState<ActorCardData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActors(FALLBACK_ACTORS)
      setIsLoading(false)
    }, 400)

    return () => window.clearTimeout(timer)
  }, [])

  return {
    actors,
    isLoading,
    isUsingFallback: false,
  }
}

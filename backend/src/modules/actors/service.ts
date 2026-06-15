import { AppError } from '../../shared/utils/app-error'
import type { Actor } from '../../shared/types/actor.type'
import { actorRepository } from './repository'

export const actorService = {
  getActors(): Actor[] {
    return actorRepository.findAll()
  },

  ensureActorExists(actorId: string): Actor {
    const actor = actorRepository.findById(actorId)
    if (!actor) {
      throw new AppError('Actor not found', 404, 'ACTOR_NOT_FOUND')
    }
    return actor
  }
}

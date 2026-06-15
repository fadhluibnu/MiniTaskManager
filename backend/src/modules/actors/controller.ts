import { asyncHandler } from '../../shared/utils/async-handler'
import { sendSuccess } from '../../shared/utils/api-response'
import { actorService } from './service'

export const actorController = {
  getActors: asyncHandler(async (_req, res) => {
    const actors = await actorService.getActors()
    return sendSuccess(res, {
      message: 'Actors retrieved successfully',
      data: actors
    })
  })
}

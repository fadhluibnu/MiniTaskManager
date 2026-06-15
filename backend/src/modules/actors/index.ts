import { Router } from 'express'
import { actorController } from './controller'

const router = Router()

router.get('/', actorController.getActors)

export default router

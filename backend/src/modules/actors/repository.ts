import path from 'path'
import env from '../../config/env'
import { jsonStorage } from '../../shared/lib/json-storage'
import type { Actor } from '../../shared/types/actor.type'

const ACTORS_FILE = path.join(env.dataDir, 'actors.json')

export const actorRepository = {
  findAll(): Actor[] {
    return jsonStorage.readAll<Actor>(ACTORS_FILE)
  },
  findById(id: string): Actor | undefined {
    return jsonStorage.findOne<Actor>(ACTORS_FILE, 'id', id)
  }
}

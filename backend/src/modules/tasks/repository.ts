import path from 'path'
import env from '../../config/env'
import { jsonStorage } from '../../shared/lib/json-storage'
import type { Task } from '../../shared/types/task.type'

const TASKS_FILE = path.join(env.dataDir, 'tasks.json')

export const taskRepository = {
  findAll(): Task[] {
    return jsonStorage.readAll<Task>(TASKS_FILE)
  },
  findById(id: string): Task | undefined {
    return jsonStorage.findOne<Task>(TASKS_FILE, 'id', id)
  },
  findActive(): Task[] {
    return taskRepository.findAll().filter((task) => task.deletedAt === null)
  },
  insert(task: Task): Task {
    return jsonStorage.insert<Task>(TASKS_FILE, task)
  },
  saveAll(tasks: Task[]): void {
    jsonStorage.writeAll<Task>(TASKS_FILE, tasks)
  }
}

import cuid from 'cuid'
import { STATUS_FLOW } from '../../shared/constants'
import { AppError } from '../../shared/utils/app-error'
import type { AuditLog } from '../../shared/types/audit-log.type'
import type { Task } from '../../shared/types/task.type'
import { actorService } from '../actors/service'
import { auditLogRepository } from '../audit-logs/repository'
import { taskRepository } from './repository'
import type {
  CreateTaskInput,
  DeleteTaskInput,
  DeleteTaskResult,
  GetTasksQuery,
  UpdateTaskStatusInput,
  UpdateTaskStatusResult
} from './type'

function findActiveTaskOrThrow(taskId: string): Task {
  const task = taskRepository.findById(taskId)
  if (!task) {
    throw new AppError('Task not found', 404, 'TASK_NOT_FOUND')
  }
  if (task.deletedAt !== null) {
    throw new AppError('Task not found', 404, 'TASK_NOT_FOUND')
  }
  return task
}

function commitTaskAndAuditLog(tasks: Task[], auditLog: AuditLog): void {
  taskRepository.saveAll(tasks)
  auditLogRepository.insert(auditLog)
}

function replaceTask(tasks: Task[], updated: Task): Task[] {
  return tasks.map((task) => (task.id === updated.id ? updated : task))
}

function getActiveTasks(query: GetTasksQuery): Task[] {
  const tasks = taskRepository.findActive()
  const search = query.search?.trim()
  if (!search) {
    return tasks
  }
  const needle = search.toLowerCase()
  return tasks.filter((task) => task.title.toLowerCase().includes(needle))
}

function createTask(input: CreateTaskInput): Task {
  const actor = actorService.ensureActorExists(input.actorId)
  const now = new Date().toISOString()
  const newTask: Task = {
    id: cuid(),
    title: input.title,
    description: input.description,
    status: 'to_do',
    createdByActorId: actor.id,
    createdByActorName: actor.name,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    deletedByActorId: null,
    deletedByActorName: null
  }
  return taskRepository.insert(newTask)
}

function updateTaskStatus(
  taskId: string,
  input: UpdateTaskStatusInput
): UpdateTaskStatusResult {
  const actor = actorService.ensureActorExists(input.actorId)
  const task = findActiveTaskOrThrow(taskId)

  if (task.status === input.toStatus) {
    return { changed: false, task, auditLog: null }
  }

  const nextStatus = STATUS_FLOW[task.status]
  if (nextStatus === null || nextStatus !== input.toStatus) {
    throw new AppError(
      'Invalid status transition',
      400,
      'INVALID_STATUS_TRANSITION'
    )
  }

  const now = new Date().toISOString()
  const updatedTask: Task = {
    ...task,
    status: input.toStatus,
    updatedAt: now
  }
  const auditLog: AuditLog = {
    id: cuid(),
    taskId: task.id,
    taskTitle: task.title,
    actorId: actor.id,
    actorName: actor.name,
    eventType: 'STATUS_CHANGED',
    fromStatus: task.status,
    toStatus: input.toStatus,
    createdAt: now
  }

  const tasks = replaceTask(taskRepository.findAll(), updatedTask)
  commitTaskAndAuditLog(tasks, auditLog)

  return { changed: true, task: updatedTask, auditLog }
}

function deleteTask(taskId: string, input: DeleteTaskInput): DeleteTaskResult {
  const actor = actorService.ensureActorExists(input.actorId)
  const task = findActiveTaskOrThrow(taskId)

  const now = new Date().toISOString()
  const deletedTask: Task = {
    ...task,
    deletedAt: now,
    deletedByActorId: actor.id,
    deletedByActorName: actor.name,
    updatedAt: now
  }
  const auditLog: AuditLog = {
    id: cuid(),
    taskId: task.id,
    taskTitle: task.title,
    actorId: actor.id,
    actorName: actor.name,
    eventType: 'TASK_DELETED',
    fromStatus: task.status,
    toStatus: null,
    createdAt: now
  }

  const tasks = replaceTask(taskRepository.findAll(), deletedTask)
  commitTaskAndAuditLog(tasks, auditLog)

  return { task: deletedTask, auditLog }
}

export const taskService = {
  getActiveTasks,
  getActiveTaskById: findActiveTaskOrThrow,
  createTask,
  updateTaskStatus,
  deleteTask
}

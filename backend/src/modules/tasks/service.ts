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
  UpdateTaskInput,
  UpdateTaskResult,
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

function sortByDeletedAtDesc(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const aTime = a.deletedAt ?? ''
    const bTime = b.deletedAt ?? ''
    return bTime.localeCompare(aTime)
  })
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

function getDeletedTasks(): Task[] {
  return sortByDeletedAtDesc(taskRepository.findDeleted())
}

function getDeletedTaskById(taskId: string): Task {
  const task = taskRepository.findById(taskId)
  if (!task || task.deletedAt === null) {
    throw new AppError('Deleted task not found', 404, 'DELETED_TASK_NOT_FOUND')
  }
  return task
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

function updateTask(taskId: string, input: UpdateTaskInput): UpdateTaskResult {
  // Validate the actor even though no audit log is generated — symmetry
  // with create / updateStatus / delete and a hard guard against unknown
  // actor IDs being stored elsewhere in the future.
  actorService.ensureActorExists(input.actorId)

  // 404 TASK_NOT_FOUND when the task is missing OR soft-deleted (the
  // helper throws the same error for both cases, matching this endpoint's
  // contract).
  const task = findActiveTaskOrThrow(taskId)

  // Zod has already trimmed; normalise empty description to undefined so
  // a description-less task and a payload of `""` are treated as equal.
  const nextTitle = input.title
  const nextDescription =
    input.description && input.description.length > 0
      ? input.description
      : undefined

  const titleUnchanged = task.title === nextTitle
  const descriptionUnchanged =
    (task.description ?? undefined) === nextDescription
  if (titleUnchanged && descriptionUnchanged) {
    return { changed: false, task }
  }

  // No audit log: this endpoint intentionally does not call
  // commitTaskAndAuditLog. The spread preserves status, createdBy*,
  // deletedAt, and deletedBy* — only title / description / updatedAt
  // change.
  const updatedTask: Task = {
    ...task,
    title: nextTitle,
    description: nextDescription,
    updatedAt: new Date().toISOString()
  }

  const tasks = replaceTask(taskRepository.findAll(), updatedTask)
  taskRepository.saveAll(tasks)
  return { changed: true, task: updatedTask }
}

export const taskService = {
  getActiveTasks,
  getActiveTaskById: findActiveTaskOrThrow,
  getDeletedTasks,
  getDeletedTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
}

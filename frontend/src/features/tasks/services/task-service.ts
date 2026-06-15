import { extractApiData } from '@/shared/lib/api-helpers'
import httpClient from '@/shared/lib/http-client'
import type { AuditLog } from '@/features/audit-logs/types/audit-log'
import type { CreateTaskInput } from '../schemas/create-task-schema'
import type { Task } from '../types/task'
import type { TaskStatus } from '../types/task-status'

export interface GetTasksParams {
  search?: string
}

export interface CreateTaskPayload extends CreateTaskInput {
  actorId: string
}

/**
 * Mirrors the backend `UpdateTaskStatusResult` union.
 *
 * - `changed: true`  → status moved one step forward, a `STATUS_CHANGED` audit log was created.
 * - `changed: false` → no-op (current status already matches), no audit log created.
 */
export type UpdateTaskStatusResult =
  | { changed: true; task: Task; auditLog: AuditLog }
  | { changed: false; task: Task; auditLog: null }

export interface UpdateTaskStatusVars {
  taskId: string
  actorId: string
  toStatus: TaskStatus
}

/**
 * Input vars for the `updateTask` service call. The backend accepts
 * `actorId`, `title`, and an optional `description`; `taskId` is
 * extracted from the URL.
 */
export interface UpdateTaskInput {
  taskId: string
  actorId: string
  title: string
  description?: string
}

/**
 * Mirrors the backend `UpdateTaskResult` union.
 *
 * - `changed: true`  → title or description actually differed, `updatedAt` was bumped.
 * - `changed: false` → no-op (identical values), `updatedAt` left alone.
 */
export type UpdateTaskResult = { changed: true; task: Task } | { changed: false; task: Task }

export interface DeleteTaskVars {
  taskId: string
  actorId: string
}

export interface DeleteTaskResult {
  task: Task
  auditLog: AuditLog
}

async function getActiveTasks(params?: GetTasksParams): Promise<Task[]> {
  const response = await httpClient.get('/tasks', { params })
  return extractApiData<Task[]>(response)
}

async function getActiveTaskById(taskId: string): Promise<Task> {
  const response = await httpClient.get(`/tasks/${taskId}/detail`)
  return extractApiData<Task>(response)
}

/**
 * Returns audit logs scoped to a single task, newest first.
 *
 * The backend endpoint returns logs for any task ID (active or deleted),
 * so this is reused by both the active and deleted task detail pages.
 * It never returns 404 — a missing task simply yields an empty array.
 */
async function getTaskAuditLogs(taskId: string): Promise<AuditLog[]> {
  const response = await httpClient.get(`/tasks/${taskId}/audit-logs`)
  return extractApiData<AuditLog[]>(response)
}

async function getDeletedTasks(): Promise<Task[]> {
  const response = await httpClient.get('/tasks/deleted')
  return extractApiData<Task[]>(response)
}

/**
 * Returns the detail of a single soft-deleted task.
 *
 * Returns 404 with code `DELETED_TASK_NOT_FOUND` if the task does not
 * exist OR exists but has not been soft-deleted. Hooks that consume
 * this should map that 404 to a "not found" UI state.
 */
async function getDeletedTaskById(taskId: string): Promise<Task> {
  const response = await httpClient.get(`/tasks/deleted/${taskId}/detail`)
  return extractApiData<Task>(response)
}

async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const response = await httpClient.post('/tasks', payload)
  return extractApiData<Task>(response)
}

async function updateTaskStatus(vars: UpdateTaskStatusVars): Promise<UpdateTaskStatusResult> {
  const response = await httpClient.patch(`/tasks/${vars.taskId}/status`, {
    actorId: vars.actorId,
    toStatus: vars.toStatus,
  })
  return extractApiData<UpdateTaskStatusResult>(response)
}

/**
 * Edits a task's title and/or description. Status cannot be changed
 * through this endpoint; use `updateTaskStatus` for status transitions.
 *
 * The backend intentionally does not create an audit log for edits.
 */
async function updateTask(payload: UpdateTaskInput): Promise<UpdateTaskResult> {
  const { taskId, ...body } = payload
  const response = await httpClient.patch(`/tasks/${taskId}`, body)
  return extractApiData<UpdateTaskResult>(response)
}

async function deleteTask(vars: DeleteTaskVars): Promise<DeleteTaskResult> {
  const response = await httpClient.delete(`/tasks/${vars.taskId}/delete`, {
    data: { actorId: vars.actorId },
  })
  return extractApiData<DeleteTaskResult>(response)
}

export const taskService = {
  getActiveTasks,
  getActiveTaskById,
  getTaskAuditLogs,
  getDeletedTasks,
  getDeletedTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
}

# API Documentation — Mini Task Manager

Base URL: `http://localhost:5050/api`

> All endpoints return a consistent JSON response shape:
>
> ```json
> {
>   "success": true | false,
>   "message": "Human-readable message",
>   "data": { ... } | null,
>   "error": { "code": "MACHINE_READABLE_CODE", "details": ... }  // only on errors
> }
> ```

---

## Table of Contents

- [Health Check](#health-check)
- [Actors](#actors)
- [Tasks](#tasks)
- [Audit Logs](#audit-logs)
- [Error Codes](#error-codes)
- [Conventions](#conventions)

---

## Health Check

### `GET /api/status`

Confirms the server is running.

**Request**

```
GET /api/status
```

**Response — 200 OK**

```json
{
  "success": true,
  "message": "Server is running",
  "data": { "status": "ok" }
}
```

---

## Actors

### `GET /api/actors`

Returns the predefined list of actors used to populate the actor selector
and to validate identity metadata for create / update / delete actions.

**Request**

```
GET /api/actors
```

No request body, params, or query.

**Response — 200 OK**

```json
{
  "success": true,
  "message": "Actors retrieved successfully",
  "data": [
    { "id": "john.doe", "name": "John Doe" },
    { "id": "jane.smith", "name": "Jane Smith" },
    { "id": "admin.user", "name": "Admin User" }
  ]
}
```

**Errors**

This endpoint does not return user errors under normal use.

---

## Tasks

> All task-mutating endpoints (`POST`, `PATCH`, `DELETE`) require a valid
> `actorId` in the request body. The backend validates that the submitted
> actor ID exists in the predefined actor list.

### `GET /api/tasks`

Returns all **active** tasks (i.e. tasks with `deletedAt === null`).
Supports optional case-insensitive substring search by `title`.

**Request**

```
GET /api/tasks
GET /api/tasks?search=report
```

**Query parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `search` | string | no | Case-insensitive substring match against `title`. Empty / whitespace is treated as no search. |

**Response — 200 OK**

```json
{
  "success": true,
  "message": "Active tasks retrieved successfully",
  "data": [
    {
      "id": "task_001",
      "title": "Prepare sprint report",
      "description": "Summarize current task progress for the internal team.",
      "status": "in_progress",
      "createdByActorId": "john.doe",
      "createdByActorName": "John Doe",
      "createdAt": "2026-06-15T02:10:00.000Z",
      "updatedAt": "2026-06-15T03:59:00.000Z",
      "deletedAt": null,
      "deletedByActorId": null,
      "deletedByActorName": null
    }
  ]
}
```

**Errors**

None — empty result returns `200` with `data: []`.

---

### `GET /api/tasks/:taskId/detail`

Returns the detail of a single **active** task (i.e. a task with
`deletedAt === null`). The task is returned as a full object identical
in shape to entries from `GET /api/tasks`.

Deleted tasks are NOT returned by this endpoint — they are accessible
through a separate deleted-task endpoint (out of scope for this version).

**Request**

```
GET /api/tasks/task_001/detail
```

**URL parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskId` | string | yes | Task ID. |

**Response — 200 OK**

```json
{
  "success": true,
  "message": "Task retrieved successfully",
  "data": {
    "id": "task_001",
    "title": "Prepare sprint report",
    "description": "Summarize current task progress for the internal team.",
    "status": "in_progress",
    "createdByActorId": "john.doe",
    "createdByActorName": "John Doe",
    "createdAt": "2026-06-14T19:58:00.000Z",
    "updatedAt": "2026-06-15T03:59:00.000Z",
    "deletedAt": null,
    "deletedByActorId": null,
    "deletedByActorName": null
  }
}
```

**Errors**

| Status | Code | When |
|--------|------|------|
| `400` | `VALIDATION_ERROR` | Empty or missing `taskId` in URL params. |
| `404` | `TASK_NOT_FOUND` | Task ID does not exist, OR the task has been soft-deleted (active-task endpoint returns 404 from the active perspective). |

---

### `GET /api/tasks/deleted`

Returns all **soft-deleted** tasks, sorted by `deletedAt` **newest first**.
A task is considered deleted when its `deletedAt` field is non-null.

The list endpoint is read-only; deleted tasks cannot be modified or
restored through this endpoint.

Search is intentionally **client-side** per project spec — no
`?search=` query is supported by this endpoint. Filter the response on
the frontend if needed.

**Request**

```
GET /api/tasks/deleted
```

No request body, URL params, or query string.

**Response — 200 OK**

```json
{
  "success": true,
  "message": "Deleted tasks retrieved successfully",
  "data": [
    {
      "id": "task_001",
      "title": "halo",
      "description": "hai",
      "status": "to_do",
      "createdByActorId": "john.doe",
      "createdByActorName": "John Doe",
      "createdAt": "2026-06-15T03:58:00.000Z",
      "updatedAt": "2026-06-15T03:58:00.000Z",
      "deletedAt": "2026-06-15T03:58:00.000Z",
      "deletedByActorId": "john.doe",
      "deletedByActorName": "John Doe"
    }
  ]
}
```

If no tasks have been deleted:

```json
{
  "success": true,
  "message": "Deleted tasks retrieved successfully",
  "data": []
}
```

**Errors**

This endpoint does not return user errors under normal use.

---

### `GET /api/tasks/deleted/:taskId/detail`

Returns the detail of a single **soft-deleted** task (i.e. a task with
`deletedAt !== null`). Active tasks are NOT returned by this endpoint
and yield a 404 from the deleted-task perspective.

**Request**

```
GET /api/tasks/deleted/task_001/detail
```

**URL parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskId` | string | yes | Task ID. |

**Response — 200 OK**

```json
{
  "success": true,
  "message": "Deleted task retrieved successfully",
  "data": {
    "id": "task_001",
    "title": "halo",
    "description": "hai",
    "status": "to_do",
    "createdByActorId": "john.doe",
    "createdByActorName": "John Doe",
    "createdAt": "2026-06-15T03:58:00.000Z",
    "updatedAt": "2026-06-15T03:58:00.000Z",
    "deletedAt": "2026-06-15T03:58:00.000Z",
    "deletedByActorId": "john.doe",
    "deletedByActorName": "John Doe"
  }
}
```

**Errors**

| Status | Code | When |
|--------|------|------|
| `400` | `VALIDATION_ERROR` | Empty or missing `taskId` in URL params. |
| `404` | `DELETED_TASK_NOT_FOUND` | Task ID does not exist, OR the task exists but is not soft-deleted (active-task endpoint returns 404 from the deleted perspective). |

---

### `POST /api/tasks`

Creates a new task. The new task always starts with status `to_do`.
**No audit log is created for task creation** (per PRD §12.1 rule 11):
the creator is stored as denormalized metadata on the task itself.

**Request**

```
POST /api/tasks
Content-Type: application/json
```

```json
{
  "title": "Prepare sprint report",
  "description": "Summarize current task progress for the internal team.",
  "actorId": "john.doe"
}
```

**Body fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | yes | Trimmed. 1–255 characters. |
| `description` | string | no | Trimmed. Up to 2000 characters. |
| `actorId` | string | yes | Must exist in the predefined actor list. |

**Response — 201 Created**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "task_001",
    "title": "Prepare sprint report",
    "description": "Summarize current task progress for the internal team.",
    "status": "to_do",
    "createdByActorId": "john.doe",
    "createdByActorName": "John Doe",
    "createdAt": "2026-06-15T02:10:00.000Z",
    "updatedAt": "2026-06-15T02:10:00.000Z",
    "deletedAt": null,
    "deletedByActorId": null,
    "deletedByActorName": null
  }
}
```

**Errors**

| Status | Code | When |
|--------|------|------|
| `400` | `VALIDATION_ERROR` | Empty / oversized `title`, missing `actorId`, or invalid body shape. |
| `404` | `ACTOR_NOT_FOUND` | `actorId` is not in the predefined actor list. |

---

### `PATCH /api/tasks/:taskId`

Edits a task's `title` and/or `description`. Behavior:

- **Actual change detected** (title or description differs from current) → `200 OK` with `{ changed: true, task: <updated task with bumped updatedAt> }`. `updatedAt` is bumped.
- **No change** (identical values submitted) → `200 OK` with `{ changed: false, task: <unchanged task> }`. `updatedAt` is NOT bumped.
- **Task not found** OR **task soft-deleted** → `404` `TASK_NOT_FOUND`.
- **Empty title / oversized title or description** → `400` `VALIDATION_ERROR`.
- **Unknown actor** → `404` `ACTOR_NOT_FOUND`.

Status **cannot** be modified through this endpoint — use
`PATCH /api/tasks/:taskId/status` for status transitions. The Zod
schema does not include `status`; any `status` field in the body is
ignored.

No audit log is created by this endpoint. The audit trail remains
limited to `STATUS_CHANGED` and `TASK_DELETED` events.

`createdByActorId`, `createdByActorName`, `deletedAt`,
`deletedByActorId`, and `deletedByActorName` are preserved on every
edit.

**Request**

```
PATCH /api/tasks/task_001
Content-Type: application/json
```

```json
{
  "actorId": "john.doe",
  "title": "Buy groceries (milk, eggs)",
  "description": "Updated list with prices"
}
```

**Body fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actorId` | string | yes | Must exist in the predefined actor list. |
| `title` | string | yes | Trimmed. 1–255 characters. |
| `description` | string | no | Trimmed. Up to 2000 characters. Omit or send `""` to clear. |

**Response — 200 OK (changed)**

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "changed": true,
    "task": {
      "id": "task_001",
      "title": "Buy groceries (milk, eggs)",
      "description": "Updated list with prices",
      "status": "to_do",
      "createdByActorId": "john.doe",
      "createdByActorName": "John Doe",
      "createdAt": "2026-06-15T02:10:00.000Z",
      "updatedAt": "2026-06-15T04:30:00.000Z",
      "deletedAt": null,
      "deletedByActorId": null,
      "deletedByActorName": null
    }
  }
}
```

**Response — 200 OK (no change)**

```json
{
  "success": true,
  "message": "No changes to update",
  "data": {
    "changed": false,
    "task": {
      "id": "task_001",
      "title": "Current title",
      "description": "Current description",
      "status": "to_do",
      "createdByActorId": "john.doe",
      "createdByActorName": "John Doe",
      "createdAt": "2026-06-15T02:10:00.000Z",
      "updatedAt": "2026-06-15T02:10:00.000Z",
      "deletedAt": null,
      "deletedByActorId": null,
      "deletedByActorName": null
    }
  }
}
```

**Errors**

| Status | Code | When |
|--------|------|------|
| `400` | `VALIDATION_ERROR` | Empty / missing `title`, `title` > 255 chars, `description` > 2000 chars, missing or empty `actorId`. |
| `404` | `ACTOR_NOT_FOUND` | `actorId` is not in the predefined actor list. |
| `404` | `TASK_NOT_FOUND` | Task ID does not exist, OR the task has been soft-deleted. |

---

### `PATCH /api/tasks/:taskId/status`

Moves a task to the requested status. Behavior:

- **Same status** → `200 OK` with `{ changed: false, ..., auditLog: null }` (idempotent no-op; no audit log).
- **Valid one-step forward transition** → `200 OK` with `{ changed: true, ..., auditLog: <STATUS_CHANGED log> }`.
- **Skipped / backward / from `done` transitions** → `400` `INVALID_STATUS_TRANSITION`.
- **Task not found** → `404` `TASK_NOT_FOUND`.
- **Task already soft-deleted** → `409` `TASK_ALREADY_DELETED`.

Valid transitions only:

```
to_do → pending
pending → in_progress
in_progress → done
```

**Request**

```
PATCH /api/tasks/task_001/status
Content-Type: application/json
```

```json
{
  "actorId": "jane.smith",
  "toStatus": "pending"
}
```

**Body fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actorId` | string | yes | Must exist in the predefined actor list. |
| `toStatus` | string | yes | One of `to_do`, `pending`, `in_progress`, `done`. |

**Response — 200 OK (changed)**

```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": {
    "changed": true,
    "task": {
      "id": "task_001",
      "title": "Prepare sprint report",
      "status": "pending",
      "updatedAt": "2026-06-15T04:00:00.000Z"
    },
    "auditLog": {
      "id": "audit_001",
      "taskId": "task_001",
      "taskTitle": "Prepare sprint report",
      "actorId": "jane.smith",
      "actorName": "Jane Smith",
      "eventType": "STATUS_CHANGED",
      "fromStatus": "to_do",
      "toStatus": "pending",
      "createdAt": "2026-06-15T04:00:00.000Z"
    }
  }
}
```

**Response — 200 OK (no-op, same status)**

```json
{
  "success": true,
  "message": "Task status is already set to the requested status",
  "data": {
    "changed": false,
    "task": {
      "id": "task_001",
      "title": "Prepare sprint report",
      "status": "in_progress"
    },
    "auditLog": null
  }
}
```

**Errors**

| Status | Code | When |
|--------|------|------|
| `400` | `VALIDATION_ERROR` | Missing or invalid `actorId` / `toStatus`. |
| `400` | `INVALID_STATUS_TRANSITION` | `toStatus` skips a step, goes backward, or `done` is not the final state. |
| `404` | `TASK_NOT_FOUND` | Task ID does not exist. |
| `404` | `ACTOR_NOT_FOUND` | `actorId` is not in the predefined actor list. |
| `409` | `TASK_ALREADY_DELETED` | Task exists but has been soft-deleted. |

---

### `DELETE /api/tasks/:taskId/delete`

Soft-deletes a task. The task remains in storage with `deletedAt` set, so
its audit history stays intact. The task disappears from `GET /api/tasks`
and any subsequent PATCH/DELETE on it returns `409 TASK_ALREADY_DELETED`.

A `TASK_DELETED` audit log is created with `toStatus: null` and the
task's last status recorded in `fromStatus`.

**Request**

```
DELETE /api/tasks/task_001/delete
Content-Type: application/json
```

```json
{
  "actorId": "admin.user"
}
```

**Body fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `actorId` | string | yes | Must exist in the predefined actor list. |

**Response — 200 OK**

```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": {
    "task": {
      "id": "task_001",
      "title": "Prepare sprint report",
      "status": "in_progress",
      "deletedAt": "2026-06-15T04:10:00.000Z",
      "deletedByActorId": "admin.user",
      "deletedByActorName": "Admin User"
    },
    "auditLog": {
      "id": "audit_002",
      "taskId": "task_001",
      "taskTitle": "Prepare sprint report",
      "actorId": "admin.user",
      "actorName": "Admin User",
      "eventType": "TASK_DELETED",
      "fromStatus": "in_progress",
      "toStatus": null,
      "createdAt": "2026-06-15T04:10:00.000Z"
    }
  }
}
```

**Errors**

| Status | Code | When |
|--------|------|------|
| `400` | `VALIDATION_ERROR` | Missing or invalid `actorId`. |
| `404` | `TASK_NOT_FOUND` | Task ID does not exist. |
| `404` | `ACTOR_NOT_FOUND` | `actorId` is not in the predefined actor list. |
| `409` | `TASK_ALREADY_DELETED` | Task exists but is already soft-deleted. |

---

### `GET /api/tasks/:taskId/audit-logs`

Returns the audit log entries for a specific task, newest first.

**Request**

```
GET /api/tasks/task_001/audit-logs
```

**URL parameters**

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `taskId` | string | yes | Task ID. |

**Response — 200 OK**

```json
{
  "success": true,
  "message": "Task audit logs retrieved successfully",
  "data": [
    {
      "id": "audit_002",
      "taskId": "task_001",
      "taskTitle": "Prepare sprint report",
      "actorId": "admin.user",
      "actorName": "Admin User",
      "eventType": "TASK_DELETED",
      "fromStatus": "in_progress",
      "toStatus": null,
      "createdAt": "2026-06-15T04:10:00.000Z"
    },
    {
      "id": "audit_001",
      "taskId": "task_001",
      "taskTitle": "Prepare sprint report",
      "actorId": "jane.smith",
      "actorName": "Jane Smith",
      "eventType": "STATUS_CHANGED",
      "fromStatus": "to_do",
      "toStatus": "pending",
      "createdAt": "2026-06-15T04:00:00.000Z"
    }
  ]
}
```

**Errors**

| Status | Code | When |
|--------|------|------|
| `400` | `VALIDATION_ERROR` | Empty / missing `taskId`. |

> Note: this endpoint returns audit logs for any task ID (active or deleted),
> so logs remain viewable after a task is soft-deleted. Logs include
> denormalized snapshots (`taskTitle`, `actorName`) so they remain
> understandable even after the related task is gone.

---

## Audit Logs

### `GET /api/audit-logs`

Returns the global audit trail across **all** tasks — including logs from
soft-deleted tasks. Newest first.

**Request**

```
GET /api/audit-logs
```

**Response — 200 OK**

```json
{
  "success": true,
  "message": "Global audit trail retrieved successfully",
  "data": [
    {
      "id": "audit_003",
      "taskId": "task_002",
      "taskTitle": "Update documentation",
      "actorId": "jane.smith",
      "actorName": "Jane Smith",
      "eventType": "TASK_DELETED",
      "fromStatus": "in_progress",
      "toStatus": null,
      "createdAt": "2026-06-15T05:00:00.000Z",
      "taskState": "deleted"
    },
    {
      "id": "audit_002",
      "taskId": "task_001",
      "taskTitle": "Prepare sprint report",
      "actorId": "admin.user",
      "actorName": "Admin User",
      "eventType": "TASK_DELETED",
      "fromStatus": "in_progress",
      "toStatus": null,
      "createdAt": "2026-06-15T04:10:00.000Z",
      "taskState": "deleted"
    }
  ]
}
```

**`taskState` enrichment**

Each log in the response includes a `taskState` field, computed at
response time by cross-referencing the tasks repository. The field is
**not** persisted in `audit-logs.json` — it is recomputed on every
request so it always reflects the current task state.

| Value | When |
|-------|------|
| `"active"` | The related task still exists and has `deletedAt === null`. |
| `"deleted"` | The related task exists and has been soft-deleted. |
| `"unknown"` | The related task cannot be found in `tasks.json` (orphaned log — defensive case). |

The frontend uses `taskState` to determine the navigation target of
the "View Task" button:

- `taskState === "active"` → navigate to `/tasks/:taskId`
- `taskState === "deleted"` → navigate to `/deleted-tasks/:taskId`
- `taskState === "unknown"` → hide the "View Task" button or disable
  navigation

**Audit log event types**

| Event type | Trigger | `toStatus` |
|------------|---------|------------|
| `STATUS_CHANGED` | Valid one-step status transition. | The new status. |
| `TASK_DELETED` | Task soft-deleted. | `null` |

---

## Error Codes

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `VALIDATION_ERROR` | 400 | Zod validation failed for body / params / query. `error.details` contains the Zod issue list. |
| `INVALID_STATUS_TRANSITION` | 400 | Status transition is skipped, backward, or attempted from `done`. |
| `TASK_NOT_FOUND` | 404 | Task ID does not exist (active-task endpoint), OR task does not exist / has been soft-deleted (edit endpoint). |
| `ACTOR_NOT_FOUND` | 404 | `actorId` is not in the predefined actor list. |
| `TASK_ALREADY_DELETED` | 409 | Task exists but has already been soft-deleted (returned by `PATCH /:taskId/status` and `DELETE /:taskId/delete`). |
| `INTERNAL_SERVER_ERROR` | 500 | Unexpected error. Stack trace is suppressed in production. |
| `DELETED_TASK_NOT_FOUND` | 404 | Task does not exist, or exists but has not been soft-deleted (accessed via the deleted-task endpoint). |

### Example error response

```json
{
  "success": false,
  "message": "Invalid status transition",
  "data": null,
  "error": {
    "code": "INVALID_STATUS_TRANSITION"
  }
}
```

Validation error example:

```json
{
  "success": false,
  "message": "title: Title is required",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "code": "too_small",
        "minimum": 1,
        "type": "string",
        "inclusive": true,
        "exact": false,
        "message": "Title is required",
        "path": ["title"]
      }
    ]
  }
}
```

---

## Conventions

1. **Status flow** — `to_do → pending → in_progress → done`. No skipping, no backward moves, no transitions from `done`. Same-status updates are idempotent no-ops.

2. **Actor validation** — every `POST /api/tasks`, `PATCH /api/tasks/:id/status`, and `DELETE /api/tasks/:id` must include an `actorId` that exists in the predefined list. The backend rejects unknown IDs with `404 ACTOR_NOT_FOUND`.

3. **Soft delete** — deleting a task does not remove it from the JSON file. It sets `deletedAt` / `deletedByActorId` / `deletedByActorName` and creates a `TASK_DELETED` audit log. Deleted tasks are excluded from `GET /api/tasks` and return `409` on subsequent PATCH/DELETE.

4. **Audit log immutability** — there is no API to update or delete audit log entries. Logs are append-only.

5. **Audit log order** — both `GET /api/audit-logs` and `GET /api/tasks/:taskId/audit-logs` return logs in **newest-first** order (per SYSTEM_DESIGN §12).

6. **Denormalized snapshots** — audit logs store `taskTitle` and `actorName` at the time of the event so logs remain readable after the related task is deleted or the actor is renamed in the future.

7. **Timestamps** — all timestamps are ISO 8601 strings in UTC (e.g. `2026-06-15T02:10:00.000Z`).

8. **No authentication** — actor identity is selected manually from a predefined list. The backend does not verify that the actor matches the requester.

9. **JSON file persistence** — data lives in `backend/src/data/{tasks,audit-logs,actors}.json`. There are no real database transactions; consistency is enforced by keeping task mutation and audit log creation in a single service flow (see `commitTaskAndAuditLog` in `src/modules/tasks/service.ts`).

10. **Action-suffix URL convention** — any endpoint that takes a `:taskId` (or any other parent resource ID) must end with an action name, not the bare ID. For example, `DELETE /api/tasks/:taskId` is not allowed; the canonical form is `DELETE /api/tasks/:taskId/delete`. This makes URLs self-describing and easier to debug in network logs.

11. **Controller response style** — controllers use the object-based `sendSuccess` / `sendError` helpers (see `html/panduan-writing-controller.md`):
    ```ts
    return sendSuccess(res, { message: 'Task created successfully', data: task, statusCode: 201 })
    return sendError(res, { message: 'Task not found', statusCode: 404, code: 'TASK_NOT_FOUND' })
    ```

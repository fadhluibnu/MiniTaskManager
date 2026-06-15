# System Design — Mini Task Manager with Audit Log

## 1. Overview

Mini Task Manager with Audit Log is a small full-stack application for managing internal team tasks. The system allows users to create tasks, move tasks through a fixed status flow, delete tasks using soft delete, and view audit logs for task status changes and deletion events.

The application is intentionally designed to be simple, easy to run locally, and easy to review. Persistence uses JSON files instead of a database to avoid external setup requirements while still keeping the backend architecture close to a database-based approach.

---

## 2. Goals

The system must support:

1. Creating tasks.
2. Listing active tasks.
3. Viewing active task detail.
4. Updating task status using a valid status transition.
5. Soft deleting tasks.
6. Viewing deleted tasks through a dedicated endpoint/page.
7. Viewing audit logs per task.
8. Viewing global audit trail.
9. Validating all backend inputs using Zod.
10. Keeping audit logs append-only.
11. Keeping frontend and backend easy to run locally.

---

## 3. Non-Goals

The following features are intentionally out of scope for this take-home task:

1. Authentication.
2. RBAC or ABAC authorization.
3. Database setup.
4. Database migration and seeding.
5. Redis.
6. Docker setup.
7. File upload.
8. Realtime updates.
9. Pagination and filtering for the first version.
10. Multi-user session management.

---

## 4. High-Level Architecture

```txt
Frontend (React + TypeScript + Vite)
        |
        | HTTP Request
        v
Backend (Node.js + Express + TypeScript)
        |
        | Repository abstraction
        v
JSON File Persistence
```

The backend uses a layered architecture:

```txt
Route
→ Controller
→ Service
→ Repository
→ JSON Storage Helper
→ JSON files
```

This keeps the code maintainable and makes it easier to replace JSON persistence with a real database later.

---

## 5. Technology Stack

### Frontend

| Area | Technology |
|---|---|
| UI Framework | React + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Form Handling | React Hook Form |
| Validation | Zod |
| Server State | TanStack Query |
| HTTP Client | Axios |
| Notification | React Hot Toast |
| Icons | Lucide React |
| Routing | React Router DOM |

### Backend

| Area | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Language | TypeScript |
| Validation | Zod |
| Persistence | JSON files |
| ID Generator | CUID |
| Security Headers | Helmet |
| CORS | cors |
| Logger | Morgan |
| Formatter | Prettier |
| Linter | ESLint |

---

## 6. Repository Structure

### Root Structure

```txt
mini-task-manager/
├── backend/
├── frontend/
├── docs/
└── README.md
```

### Backend Structure

```txt
backend/
├── .env.example
├── eslint.config.mjs
├── .gitignore
├── package.json
├── package-lock.json
├── .prettierignore
├── .prettierrc
├── README.md
├── src
│   ├── app.ts
│   ├── config
│   │   └── env.ts
│   ├── data
│   │   ├── actors.json
│   │   ├── audit-logs.json
│   │   └── tasks.json
│   ├── index.ts
│   ├── middlewares
│   │   ├── error.middleware.ts
│   │   └── not-found.middleware.ts
│   ├── modules
│   ├── routes.ts
│   ├── shared
│   │   ├── constants
│   │   ├── lib
│   │   │   └── json-storage.ts
│   │   ├── types
│   │   └── utils
│   │       ├── api-response.ts
│   │       ├── app-error.ts
│   │       └── async-handler.ts
│   └── validators
│       └── validate-request.ts
└── tsconfig.json
```

### Planned Backend Modules

```txt
src/modules/
├── actors/
├── tasks/
└── audit-logs/
```

Each module should follow this pattern:

```txt
[feature]/
├── controller.ts
├── service.ts
├── repository.ts
├── schema.ts
├── type.ts
└── index.ts
```

### Frontend Structure

The frontend has React Router DOM installed as routing foundation. The initial setup can remain minimal, while page-level structure will be expanded during feature implementation.

Planned frontend pages:

```txt
src/pages/
├── actor-selection-page.tsx
├── task-manager-page.tsx
├── task-detail-page.tsx
├── deleted-tasks-page.tsx
├── deleted-task-detail-page.tsx
├── global-audit-trail-page.tsx
└── not-found-page.tsx
```

---

## 7. API Base Path

All backend endpoints use the base path:

```txt
/api
```

Example:

```txt
GET /api/tasks
GET /api/actors
GET /api/audit-logs
```

---

## 8. API Response Format

All API responses must use the same shape:

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {},
  "error": null
}
```

The `error` field may be omitted when there is no error, depending on the response helper implementation. The important part is that `success`, `message`, and `data` are always consistent.

---

## 9. Data Persistence Design

Persistence uses JSON files:

```txt
src/data/
├── actors.json
├── tasks.json
└── audit-logs.json
```

JSON files are treated as a lightweight persistence layer. Controllers and services must not read or write JSON files directly.

Access must go through repositories:

```txt
Service
→ Repository
→ json-storage.ts
→ JSON file
```

### Persistence Trade-Off

JSON file persistence keeps local setup simple because reviewers do not need to install PostgreSQL, MySQL, MongoDB, Redis, or Docker.

However, JSON files do not provide real database transactions. If this application grows, persistence should be migrated to a real database and task mutation plus audit log creation should be wrapped in database transactions.

---

## 10. Core Data Models

### Actor

Actors are loaded from `src/data/actors.json`.

```ts
export interface Actor {
  id: string
  name: string
}
```

Actors are not authenticated users. They are predefined selectable identities used to simulate who performs an action.

---

### Task

```ts
export type TaskStatus = 'to_do' | 'pending' | 'in_progress' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  status: TaskStatus
  createdByActorId: string
  createdByActorName: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  deletedByActorId?: string | null
  deletedByActorName?: string | null
}
```

Important rules:

1. New tasks always start with `to_do` status.
2. Task creation stores creator metadata.
3. Task creation does not create an audit log.
4. Deleted tasks are not returned by active task endpoints.
5. Deleted tasks are accessible through dedicated deleted task endpoints.

---

### Audit Log

```ts
export type AuditLogEventType = 'STATUS_CHANGED' | 'TASK_DELETED'

export interface AuditLog {
  id: string
  taskId: string
  taskTitle: string
  actorId: string
  actorName: string
  eventType: AuditLogEventType
  fromStatus: TaskStatus
  toStatus: TaskStatus | null
  createdAt: string
}
```

Important rules:

1. Audit logs are append-only.
2. Audit logs must not be updated.
3. Audit logs must not be deleted.
4. Status changes create audit logs.
5. Task deletion creates an audit log.
6. Task creation does not create an audit log because creator metadata is stored on the task itself.

---

## 11. Task Status Flow

The valid status flow is:

```txt
to_do → pending → in_progress → done
```

Rules:

1. A task can only move one step forward.
2. A task cannot move backward.
3. A task cannot skip a status.
4. Updating to the same status is idempotent and must not create an audit log.
5. A deleted task cannot be updated.
6. A task with `done` status cannot move to another status.

Examples:

| Current Status | Target Status | Result |
|---|---|---|
| `to_do` | `pending` | Valid |
| `pending` | `in_progress` | Valid |
| `in_progress` | `done` | Valid |
| `to_do` | `in_progress` | Invalid |
| `pending` | `to_do` | Invalid |
| `done` | `done` | No-op |

---

## 12. API Endpoint Design

### Health Check

| Method | Path | Description |
|---|---|---|
| GET | `/api/status` | Check backend server status |

---

### Actors

| Method | Path | Description |
|---|---|---|
| GET | `/api/actors` | Get predefined actor list |

---

### Tasks

| Method | Path | Description |
|---|---|---|
| GET | `/api/tasks` | Get active tasks |
| POST | `/api/tasks` | Create a new task |
| GET | `/api/tasks/:taskId/detail` | Get active task detail |
| PATCH | `/api/tasks/:taskId/status` | Update task status |
| DELETE | `/api/tasks/:taskId/delete` | Soft delete task |
| GET | `/api/tasks/:taskId/audit-logs` | Get task audit logs |

**URL convention (action suffix):** endpoints that take a resource ID (e.g. `:taskId`) must end with an action name, not the bare ID. This makes URLs self-describing and easier to debug in network logs. Example: `DELETE /api/tasks/:taskId/delete` instead of `DELETE /api/tasks/:taskId`. The other implemented endpoints (`PATCH /:taskId/status`, `GET /:taskId/audit-logs`) already follow this convention.

Route declaration note:

`/api/tasks/deleted` must be registered before `/api/tasks/:taskId` to avoid route conflicts.

---

### Deleted Tasks

| Method | Path | Description |
|---|---|---|
| GET | `/api/tasks/deleted` | Get deleted tasks |
| GET | `/api/tasks/deleted/:taskId/detail` | Get deleted task detail |

Deleted tasks are considered inactive and must not be returned from `GET /api/tasks` or `GET /api/tasks/:taskId/detail`.

---

### Audit Logs

| Method | Path | Description |
|---|---|---|
| GET | `/api/audit-logs` | Get global audit trail |

Global audit trail order:

```txt
newest → oldest
```

Per-task audit logs can also use newest-to-oldest for UI consistency.

**Global audit trail response shape:** each log in `GET /api/audit-logs`
includes an enriched `taskState` field (`"active"` | `"deleted"` | `"unknown"`)
computed at response time by cross-referencing the tasks repository. The
field is **not** persisted in `audit-logs.json` — it is recomputed on
every request so it always reflects the current task state. This is what
allows the frontend "View Task" button to navigate to the correct
detail page (`/tasks/:taskId` for active, `/deleted-tasks/:taskId` for
deleted) regardless of when the audit log was originally created.

---

## 13. Request Body Design

### Create Task

```http
POST /api/tasks
```

```json
{
  "title": "Prepare sprint report",
  "description": "Summarize completed and pending work",
  "actorId": "john.doe"
}
```

Rules:

1. `title` is required.
2. `title` must be trimmed and non-empty.
3. `description` is optional.
4. `actorId` is required.
5. `actorId` must exist in `actors.json`.
6. New task status is always `to_do`.
7. No audit log is created for task creation.

---

### Update Task Status

```http
PATCH /api/tasks/:taskId/status
```

```json
{
  "actorId": "jane.smith",
  "toStatus": "pending"
}
```

Rules:

1. `actorId` is required.
2. `actorId` must exist in `actors.json`.
3. `toStatus` is required.
4. `toStatus` must be one of `to_do`, `pending`, `in_progress`, or `done`.
5. Target status must follow the allowed status flow.
6. Same status update returns success with no audit log.
7. Valid status change creates a `STATUS_CHANGED` audit log.

---

### Delete Task

```http
DELETE /api/tasks/:taskId/delete
```

```json
{
  "actorId": "admin.user"
}
```

Rules:

1. `actorId` is required.
2. `actorId` must exist in `actors.json`.
3. Task must exist and must be active.
4. Delete is implemented as soft delete.
5. Soft delete sets `deletedAt`, `deletedByActorId`, and `deletedByActorName`.
6. Soft delete creates a `TASK_DELETED` audit log.

---

## 14. Business Flow Design

### Create Task Flow

```txt
Validate request body
→ Validate actor exists
→ Create task object
→ Save task through repository
→ Return created task
```

No audit log is created in this flow.

---

### Update Status Flow

```txt
Validate request params and body
→ Validate actor exists
→ Find active task
→ Check same-status no-op
→ Validate status transition
→ Prepare updated task
→ Prepare audit log
→ Save updated task
→ Append audit log
→ Return updated task
```

If `toStatus` is the same as current status, the API returns success without creating a new audit log.

---

### Delete Task Flow

```txt
Validate request params and body
→ Validate actor exists
→ Find active task
→ Prepare soft-deleted task
→ Prepare delete audit log
→ Save soft-deleted task
→ Append audit log
→ Return deleted task summary
```

---

## 15. Data Consistency Strategy

Because JSON files do not provide real transaction support, consistency is handled through centralized service flows.

Rules:

1. Controllers must not perform business orchestration.
2. Services must prepare the task mutation and audit log together.
3. Repositories must only handle data access.
4. Audit log append must happen only after validation succeeds.
5. Known JSON persistence limitations must be documented in README.

Production improvement:

```txt
Replace JSON files with a database.
Use transaction for task update/delete + audit log insert.
```

---

## 16. Audit Log Immutability Strategy

Audit log immutability is enforced by design:

1. The audit log repository only exposes read and create/append operations.
2. There is no update audit log method.
3. There is no delete audit log method.
4. There is no API endpoint to mutate audit logs.
5. Deleted task audit logs remain visible in the global audit trail.

---

## 17. Error Handling Strategy

The backend uses centralized error handling.

Expected utilities:

```txt
src/shared/utils/app-error.ts
src/shared/utils/async-handler.ts
src/middlewares/error.middleware.ts
src/middlewares/not-found.middleware.ts
```

Error handling rules:

1. Use `AppError` for expected errors.
2. Use `asyncHandler` to avoid repeated try/catch in controllers.
3. Return consistent API error responses.
4. Do not expose internal stack traces in production.

Common error cases:

| Case | Suggested Status |
|---|---|
| Invalid request body | 400 |
| Actor not found | 404 |
| Task not found | 404 |
| Deleted task accessed through active endpoint | 404 |
| Invalid status transition | 400 |
| Unexpected error | 500 |

---

## 18. Validation Strategy

All input validation uses Zod.

Validation targets:

1. Request body.
2. Request params.
3. Request query.

Examples:

1. `createTaskSchema`
2. `updateTaskStatusSchema`
3. `deleteTaskSchema`
4. `taskParamsSchema`

Validation must happen before service execution.

---

## 19. Frontend Design

The frontend uses React Router DOM as routing foundation.

Initial routing can remain minimal, but the system is designed to support multiple pages later.

Planned routes:

| Path | Purpose |
|---|---|
| `/` | Active task list (default landing) |
| `/select-actor` | Select or change active actor |
| `/tasks` | Active task list (alias for `/`) |
| `/tasks/:taskId` | Active task detail |
| `/deleted-tasks` | Deleted task list |
| `/deleted-tasks/:taskId` | Deleted task detail |
| `/audit-logs` | Global audit trail |

Frontend state strategy:

1. TanStack Query handles server state.
2. Local React state handles UI-only state.
3. React Router DOM handles route navigation.
4. Axios handles HTTP requests through a shared HTTP client.
5. Zod and React Hook Form handle form validation.

### Frontend API integration

All five task-related pages and the global audit trail are
integrated with the backend:

- `TaskManagerPage` (`/`, `/tasks`)
- `TaskDetailPage` (`/tasks/:taskId`)
- `DeletedTasksPage` (`/deleted-tasks`)
- `DeletedTaskDetailPage` (`/deleted-tasks/:taskId`)
- `AuditLogsPage` (`/audit-logs`)

The only page still using a local mock is `SelectActorPage`
(`/select-actor` — `useActors` reads from `FALLBACK_ACTORS`); it
will be migrated to the backend in a follow-up using
`GET /api/actors`.

The pattern below is the reference for any future integration:

1. **`features/<feature>/services/<feature>-service.ts`** — owns the
   raw HTTP calls via the shared axios `httpClient`. Each function
   unwraps the backend envelope `{ success, message, data, error }`
   using `extractApiData<T>(response)` from
   `src/shared/lib/api-helpers.ts` and returns the inner `data`
   payload. Services never return the envelope itself.
2. **`features/<feature>/hooks/use-<action>.ts`** — wraps the service
   in `useQuery` (with query key from `shared/constants/query-keys.ts`)
   or `useMutation` (with cache invalidation on success and
   `extractApiError` for toast messaging on failure).
3. **Page** — only knows about the hook; never imports the service
   directly. The page is responsible for actor guards and passing
   user input into mutations.

Errors thrown by services are normalized to `ApiError` (see
`FRONTEND_RULES.md §8`) so `onError` handlers can rely on
`error.code`, `error.status`, and `error.message` regardless of
whether the failure came from the backend envelope or axios itself.

#### Detail-page error handling

`useTask` (used by `TaskDetailPage`) is a special case that
demonstrates how to use `ApiError.code` for branching instead of
treating all errors the same:

- `TASK_NOT_FOUND` (404) is caught inside the `queryFn` and mapped
  to `task: null`, so the page can render the dedicated
  `TaskNotFound` component without needing to inspect the error
  code itself.
- Other errors (500, network) bubble up to React Query as a thrown
  `ApiError`. The hook exposes `isError` and `error` so the page
  can render a separate full-page `TaskDetailError` component with
  a Retry button.
- The audit-logs section follows the same pattern at a smaller
  scale: `useTaskAuditLogs` exposes `isError` and `error`, and the
  `TaskAuditLogsSection` renders an inline error state with retry
  while leaving the rest of the page intact.

Because the audit-logs endpoint (`GET /api/tasks/:taskId/audit-logs`)
returns logs for any task ID (active or deleted), the
`useTaskAuditLogs` hook is shared between `TaskDetailPage` and
`DeletedTaskDetailPage` — integrating it once benefits both pages.

#### Deleted-list search behavior

`DeletedTasksPage` (`/deleted-tasks`) is integrated with the
backend via `GET /api/tasks/deleted`, which returns the list sorted
newest-deleted first. **Search is intentionally client-side** for
this endpoint — the backend does not support `?search=` (see
`docs/API_DOCUMENTATION.md` §"Deleted Tasks" note 1), so the page
filters the response via `filterDeletedTasks`. This is the
deliberate opposite of the active task list, where search is
server-side.

Cache sync between `/tasks` and `/deleted-tasks` is automatic: when
`useDeleteTask` invalidates `QUERY_KEYS.tasks.all` (`['tasks']`),
TanStack Query prefix-matches the deleted list key
`['tasks', 'deleted']` and re-fetches on the next mount or
explicit refetch.

#### Deleted-detail error handling

`useDeletedTask` (used by `DeletedTaskDetailPage`) is the
deleted-task mirror of `useTask`. The pattern is identical except
for the 404 code:

- `DELETED_TASK_NOT_FOUND` (404) is caught inside the `queryFn` and
  mapped to `task: null`. The page then renders the dedicated
  `DeletedTaskNotFound` component (which links to both
  `/deleted-tasks` and `/tasks`). This is **different** from the
  active detail's `TASK_NOT_FOUND` — the two endpoints use distinct
  codes so hooks can disambiguate the missing-vs-still-active
  cases correctly.
- Other errors (500, network) bubble up to React Query as a thrown
  `ApiError`. The hook exposes `isError` and `error` so the page
  can render a full-page error state.
- The page reuses `TaskDetailError` (created for the active detail
  page) with a `backTo="/deleted-tasks"` prop so the "Back to Tasks"
  link points at the deleted list rather than the active one. The
  component itself takes `backTo?: string` and defaults to
  `/tasks`, keeping the active detail page's behavior unchanged.
- `useTaskAuditLogs` is shared with `TaskDetailPage` and exposes
  `isError` / `error`; `TaskAuditLogsSection` renders an inline
  error with retry on failure.

At this point every task-related page reads from the backend; the
`features/tasks/constants/fallback-tasks.ts` mock seed is no
longer imported anywhere and can be deleted.

#### Global audit trail — `taskState` navigation

`AuditLogsPage` (`/audit-logs`) is integrated via
`GET /api/audit-logs`. The endpoint enriches each log with a
`taskState` field (`"active"` | `"deleted"` | `"unknown"`) computed
at response time by cross-referencing the tasks repository. The
field is **not** persisted — it is recomputed on every request so
it always reflects the current task state.

The `AuditLog` interface declares `taskState?: TaskState` as
**optional** so the type remains backward-compatible with the
per-task endpoint (`GET /api/tasks/:taskId/audit-logs`), which
does not return the field. The global endpoint always populates
it; per-task endpoint never does.

`getTaskDetailLink` (used by the "View Task" button in
`AuditLogItem`) prefers `taskState` when present and falls back to
the `eventType` heuristic otherwise:

| `taskState` | Resulting link |
|-------------|----------------|
| `"active"`  | `/tasks/:taskId` |
| `"deleted"` | `/deleted-tasks/:taskId` |
| `"unknown"` | `/tasks/:taskId` (best effort; the detail page renders `TaskNotFound` and the user can navigate back) |
| (absent)   | Fall back to `eventType`: `STATUS_CHANGED → /tasks`, `TASK_DELETED → /deleted-tasks` |

This is more accurate than the previous pure-`eventType` heuristic
because a `STATUS_CHANGED` log whose task has since been soft-
deleted correctly navigates to the deleted-tasks detail page
instead of the active one (where it would 404). The heuristic
fallback is kept for logs coming from the per-task endpoint.

**Search and event-type filtering** on this page remain
client-side (`filterAuditLogs`) because the backend does not
support `?search=` or `?eventType=` on this endpoint — the
contract is one HTTP fetch, then filter in the browser.

---

## 20. Security Considerations

Since authentication is out of scope, actors are manually selected from predefined JSON data.

Limitations:

1. Actor identity is not verified.
2. Any user can select any actor.
3. This is acceptable for the assignment because authentication is explicitly out of scope.

Production improvement:

```txt
Replace manual actor selection with authenticated users.
Use session/token identity as the audit actor.
Add RBAC or ABAC if role-based access is needed.
```

---

## 21. Scalability Considerations

Current limitations:

1. JSON files are not safe for high-concurrency writes.
2. No real transaction support.
3. No pagination for large task or audit log lists.
4. No indexing or query optimization.
5. No authentication.

Future improvements:

1. Replace JSON file persistence with PostgreSQL, MongoDB, or another database.
2. Add database transaction for task mutation and audit log insert.
3. Add pagination and filters.
4. Add authentication.
5. Add automated tests.
6. Add Docker setup if database or deployment complexity increases.

---

## 22. Testing Strategy

Initial validation can be done manually through API documentation or Postman.

Minimum manual test cases:

1. Create task with valid actor.
2. Reject create task with empty title.
3. Reject create task with invalid actor.
4. List active tasks.
5. Move task from `to_do` to `pending`.
6. Reject invalid status skip from `to_do` to `in_progress`.
7. Same status update returns success and does not create audit log.
8. Soft delete task.
9. Deleted task no longer appears in active task list.
10. Deleted task appears in deleted task endpoint.
11. Global audit trail shows newest logs first.
12. Audit logs cannot be updated or deleted.

Recommended automated tests later:

1. Service tests for status transition.
2. Service tests for audit log creation.
3. Repository tests for JSON storage.
4. API integration tests using Supertest.

---

## 23. Documentation Strategy

The project should include:

```txt
docs/
├── PRD.md
├── SYSTEM_DESIGN.md
├── FRONTEND_RULES.md
├── BACKEND_RULES.md
└── API_DOCUMENTATION.md
```

`API_DOCUMENTATION.md` must be updated whenever an endpoint is added or changed.

---

## 24. Key Design Decisions

| Decision | Reason |
|---|---|
| Use JSON file persistence | Keeps project easy to run without database setup |
| Use repository abstraction | Makes future database migration easier |
| No auth/RBAC | Explicitly out of scope |
| Soft delete tasks | Allows deleted task history to remain inspectable |
| Append-only audit logs | Protects audit trail integrity |
| Create task does not create audit log | Creator metadata is stored directly on the task |
| Global audit trail newest first | Better for UI review and recent activity visibility |
| Use React Router DOM | Allows future page-based structure |

---

## 25. Implementation Order

Recommended implementation order:

1. Backend actors module.
2. Backend tasks module.
3. Backend audit logs module.
4. API documentation update.
5. Frontend actor selection.
6. Frontend task list and create task form.
7. Frontend status update action.
8. Frontend delete task action.
9. Frontend task detail and audit log display.
10. Frontend deleted tasks page.
11. Frontend global audit trail page.
12. README finalization.
13. Manual testing.


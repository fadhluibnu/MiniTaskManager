# Backend Development Rules — Mini Task Manager

This document defines the backend development rules, conventions, and architecture for the **Mini Task Manager with Audit Log** project. All contributors must follow these rules to ensure consistency, maintainability, and clarity.

---

## 1. Backend Development Rules

| # | Rule |
|---|------|
| 1 | All variables, functions, and filenames must use **English** with `camelCase`. Use `snake_case` only when required by data contracts (e.g., JSON field names). |
| 2 | Every module that accepts input must have **Zod schema validation**. |
| 3 | Error and success messages must be **consistent** and written in clear English. |
| 4 | Repeated logic in controllers must be extracted into **services, repositories, helpers, or middleware**. |
| 5 | All APIs must be **documented** in `docs/API_DOCUMENTATION.md` with method, path, body, params, and response examples. |
| 6 | **HTTP methods** must match the action: GET for read, POST for create, PATCH/PUT for update, DELETE for delete. |
| 7 | **Action-suffix URL convention** — endpoints that take a parent resource ID (e.g. `:taskId`, `:auditLogId`) must not end with the bare ID. Always append an action name (e.g. `/delete`, `/status`, `/audit-logs`). This makes URLs self-describing and easier to debug in network logs. |
| 8 | Use **ESLint** for linting and **Prettier** for formatting. Run both before committing. |
| 9 | Use **environment variables** for all configuration values. Never hardcode API ports, paths, or settings. |
| 10 | Do not access `process.env` directly across files — use `src/config/env.ts` instead. |
| 11 | Every third-party or shared integration must be placed in `src/shared/lib/` or `src/shared/utils/`. |

---

## 2. Scope Adaptation for This Take-Home Task

This project is a take-home assignment, not a full production system. The following rules are adapted accordingly:

| Original Rule | Adaptation |
|---------------|-----------|
| Database migrations & models | **Not applicable.** Persistence uses JSON files. Use TypeScript types and JSON seed data instead. |
| RBAC/ABAC middleware | **Not applicable.** Authentication and authorization are explicitly out of scope. |
| Database transactions | **Not supported** in JSON file persistence. Task updates and audit log creation are kept in a single synchronous service flow. Document this limitation clearly. |
| Seeders | Use predefined JSON data in `src/data/actors.json` for initial actor data. |

---

## 3. Final Backend Libraries

| Category | Package | Purpose |
|----------|---------|---------|
| Server Framework | `express` | Build REST API |
| TypeScript Runtime | `tsx` | Run TypeScript in development (`tsx watch`) |
| Environment Config | `dotenv` | Load `.env` file |
| CORS | `cors` | Allow frontend origin access |
| Security Headers | `helmet` | Set basic HTTP security headers |
| HTTP Logger | `morgan` | Request logging in development |
| Validation | `zod` | Validate request body, params, and query |
| ID Generator | `cuid` | Generate unique IDs for tasks and audit logs |
| TypeScript | `typescript` | Type safety |
| Linter | `eslint` | Code linting |
| Formatter | `prettier` | Code formatting |
| Type Definitions | `@types/express`, `@types/cors`, `@types/morgan`, `@types/node` | TypeScript type support |

---

## 4. Folder Structure

```
backend/
├── src/
│   ├── app.ts                        # Express app configuration (middleware, routes)
│   ├── index.ts                      # Server entry point
│   ├── routes.ts                     # Root API route registration
│   ├── config/
│   │   └── env.ts                    # Centralized env variable access
│   ├── data/
│   │   ├── actors.json               # Actor seed data
│   │   ├── tasks.json                # Task persistence
│   │   └── audit-logs.json           # Audit log persistence (append-only)
│   ├── modules/                      # Feature modules (tasks, actors, audit-logs — added later)
│   │   └── [feature]/
│   │       ├── controller.ts         # Route handler functions
│   │       ├── service.ts            # Business logic
│   │       ├── repository.ts         # JSON file data access
│   │       ├── schema.ts             # Zod validation schemas
│   │       ├── type.ts               # TypeScript types for this module
│   │       └── index.ts              # Router for this module
│   ├── middlewares/
│   │   ├── error.middleware.ts       # Global error handler
│   │   └── not-found.middleware.ts   # 404 handler
│   ├── shared/
│   │   ├── constants/                # Global constants (messages, status codes)
│   │   ├── lib/
│   │   │   └── json-storage.ts       # Generic JSON read/write helper
│   │   ├── types/                    # Shared TypeScript types
│   │   └── utils/
│   │       ├── api-response.ts       # Consistent response builder
│   │       ├── app-error.ts          # AppError class for operational errors
│   │       └── async-handler.ts      # Async route wrapper
│   └── validators/
│       └── validate-request.ts       # Zod validation middleware factory
├── .env.example                      # Environment variable template
├── .prettierrc                       # Prettier config
├── eslint.config.mjs                 # ESLint config
├── package.json
└── tsconfig.json
```

---

## 5. Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Variables | `camelCase` | `taskId`, `auditLog` |
| Functions | `camelCase` | `findTaskById`, `createAuditLog` |
| Classes | `PascalCase` | `AppError` |
| Files | `kebab-case` | `json-storage.ts`, `validate-request.ts` |
| Middleware files | `kebab-case.middleware.ts` | `error.middleware.ts` |
| Constants | `UPPER_SNAKE_CASE` | `HTTP_STATUS`, `MESSAGES` |
| Types/Interfaces | `PascalCase` | `Task`, `AuditLog`, `Actor` |
| Zod schemas | `camelCase` + `Schema` suffix | `createTaskSchema`, `updateStatusSchema` |
| JSON data files | `kebab-case.json` | `tasks.json`, `audit-logs.json` |

---

## 6. Environment Variable Rules

- All env values must be accessed via `src/config/env.ts`.
- **Never** use `process.env` directly in controllers, services, or routes.
- Copy `.env.example` to `.env` and fill in values locally. Never commit `.env`.

**Available variables:**

```env
NODE_ENV=development
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173
DATA_DIR=src/data
```

**Access pattern:**

```ts
// ✅ Correct
import env from '../config/env'
const dir = env.dataDir

// ❌ Incorrect
const dir = process.env.DATA_DIR
```

---

## 7. Validation Rules

- All request inputs (body, params, query) **must** be validated with Zod before reaching the controller.
- Use `validateRequest` middleware from `src/validators/validate-request.ts`.
- Define schemas per module in `modules/[feature]/schema.ts`.
- Return a `400` status with a clear field-level error message on validation failure.

**Example:**

```ts
// modules/tasks/schema.ts
import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  actorId: z.string().min(1, 'Actor ID is required'),
})
```

---

## 8. API Response Rules

All endpoints must use `sendSuccess` or `sendError` from `src/shared/utils/api-response.ts`.

**Response shape:**

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... } | null,
  "error": [ ... ]
}
```

**Usage:**

```ts
// Success
sendSuccess(res, task, 'Task created successfully', 201)

// Error
sendError(res, 'Task not found', 404)
```

Do not call `res.json()` or `res.status().send()` directly in controllers.

---

## 9. Error Handling Rules

- Use `AppError` for known/expected errors (e.g., "Task not found").
- Use `asyncHandler` to wrap async controllers — eliminates repetitive try/catch.
- The global error middleware (`error.middleware.ts`) handles all unhandled errors.

**Usage:**

```ts
import { asyncHandler } from '../../shared/utils/async-handler'
import { AppError } from '../../shared/utils/app-error'

const getTask = asyncHandler(async (req, res) => {
  const task = repository.findById(req.params.id)
  if (!task) throw new AppError('Task not found', 404)
  sendSuccess(res, task, 'Task retrieved')
})
```

---

## 10. JSON Persistence Rules

- All JSON file read/write operations must go through `src/shared/lib/json-storage.ts`.
- **Do not** read or write JSON files directly in controllers or services.
- Repositories are the only layer that directly calls `jsonStorage`.
- Data files are located in `src/data/`.

**Layering:**

```
Controller → Service → Repository → jsonStorage → JSON file
```

**Important limitation:**

> JSON file persistence does **not** provide real transaction support. If a task update succeeds but the audit log write fails, the data will be inconsistent. In production with a real database, use database transactions.

---

## 11. Repository / Service / Controller Layering Rules

| Layer | Responsibility |
|-------|---------------|
| **Controller** | Parse request, call service, return response using `sendSuccess`/`sendError` |
| **Service** | Business logic, orchestrate repository calls, enforce rules |
| **Repository** | Data access only — read/write via `jsonStorage` |
| **jsonStorage** | Generic file I/O — no business logic |

- Controllers must not contain business logic.
- Services must not directly access JSON files.
- Repositories must not contain business logic.

---

## 12. Audit Log Immutability Rules

- Audit logs are **append-only**. Never update or delete an audit log record.
- Use `jsonStorage.insert()` only for audit logs — never `update()` or `remove()`.
- Every task create, update, and soft-delete must trigger an audit log entry.
- Audit log entries must record: `taskId`, `actorId`, `action`, `changes`, `timestamp`.

---

## 13. API Documentation Rules

- All implemented endpoints must be documented in `docs/API_DOCUMENTATION.md`.
- Documentation must include: method, path, request body/params/query, and response examples.
- Update the documentation whenever an endpoint is added or changed.
- If Postman is used, export the collection and save it to `docs/`.

---

## 14. Pre-Review Checklist

Before marking a pull request as ready for review, ensure:

- [ ] All variables and functions use English naming.
- [ ] No hardcoded configuration values (ports, paths, URLs).
- [ ] All request inputs are validated with Zod.
- [ ] ESLint passes: `npm run lint`
- [ ] TypeScript compiles: `npm run typecheck`
- [ ] Build succeeds: `npm run build`
- [ ] Prettier is applied: `npm run format:check`
- [ ] No unused imports or variables.
- [ ] All API endpoints are documented in `docs/API_DOCUMENTATION.md`.
- [ ] Audit log entries are created for every task mutation.
- [ ] JSON files are not read/written directly in controllers.
- [ ] AppError is used for known errors instead of generic throws.
- [ ] asyncHandler is used for async controller functions.

# Frontend Development Rules — Mini Task Manager

This document defines the frontend development rules, conventions, and structure for the **Mini Task Manager** project. All contributors must follow these rules to ensure code consistency, maintainability, and scalability.

---

## 1. Frontend Development Rules

| # | Rule |
|---|------|
| 1 | All variables must use **English** naming, with `camelCase` format. Use `snake_case` only when required by an external contract (e.g., API response). |
| 2 | All modules with user input must have **schema validation** using Zod. |
| 3 | Error messages and success messages must be **consistent** and written in clear English. |
| 4 | Every function must be **tested/reviewed** before marking as ready for review. |
| 5 | Repeated logic must be extracted into a **helper function** (e.g., `formatDate`, `cn`). |
| 6 | UI layout must be **responsive**, clean, and easy to understand. Align with Figma if available. |
| 7 | Use **ESLint** for linting and **Prettier** for formatting. Run both before committing. |
| 8 | All configuration values (e.g., API base URL) must be read from **environment variables**. Never hardcode them. |
| 9 | Use **TanStack Query** for server state. Use **React local state** for simple UI state. Do not use Zustand. |
| 10 | Apply **responsive design** across all pages. |
| 11 | Prepare the codebase for **code splitting and lazy loading** as the app grows. |
| 12 | Reusable components must be placed in the appropriate **shared** folder. |

---

## 2. Libraries

| Category | Library | Purpose |
|----------|---------|---------|
| Core UI | `react` | Main UI library |
| DOM Renderer | `react-dom` | Renders React to browser |
| Build Tool | `vite` | Dev server and build tool |
| React Plugin | `@vitejs/plugin-react` | Vite + React integration |
| Type Safety | `typescript` | Type-safe code |
| Styling | `tailwindcss` | Utility-first CSS framework |
| UI Components | `shadcn/ui` | Accessible, composable UI component generator |
| UI Primitive | `@radix-ui/*` / `@base-ui/*` | Headless UI primitives for shadcn |
| Form Management | `react-hook-form` | Manages form state and validation |
| Schema Validation | `zod` | Schema-based validation for inputs and API payloads |
| Form Resolver | `@hookform/resolvers` | Bridge between React Hook Form and Zod |
| Server State | `@tanstack/react-query` | Data fetching, caching, mutation, and refetching |
| HTTP Client | `axios` | HTTP requests to backend API |
| Toast Notification | `react-hot-toast` | Success/error feedback toasts |
| Class Utility | `clsx` | Conditional className merging |
| Tailwind Merge | `tailwind-merge` | Prevents conflicting Tailwind classes |
| Variant Styling | `class-variance-authority` | Variant-based component styling |
| Icons | `lucide-react` | Icon set for UI |
| Formatter | `prettier` | Code formatting |
| Linter | `eslint` | Code linting |
| Routing | `react-router-dom` | Client-side routing foundation |

---

## 3. Folder Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Root application setup
│   │   ├── App.tsx          # Root App component
│   │   └── providers.tsx    # Global providers (QueryClient, Toaster)
│   ├── components/
│   │   └── ui/              # shadcn/ui generated components (do not edit manually)
│   ├── config/
│   │   └── env.ts           # Environment variable access
│   ├── features/            # Feature-based modules (e.g., tasks, actors, audit-logs)
│   │   └── [feature-name]/
│   │       ├── components/  # Feature-specific components
│   │       ├── hooks/       # Feature-specific hooks
│   │       ├── schemas/     # Zod schemas for this feature
│   │       ├── services/    # API call functions
│   │       └── types/       # TypeScript types/interfaces
│   ├── lib/
│   │   └── utils.ts         # Utility `cn()` (required by shadcn)
│   ├── pages/               # Page-level components (route targets)
│   ├── shared/
│   │   ├── components/      # Reusable cross-feature components
│   │   ├── constants/       # Global constants (messages, query keys)
│   │   ├── lib/
│   │   │   ├── http-client.ts   # Axios instance
│   │   │   └── query-client.ts  # TanStack QueryClient config
│   │   └── utils/           # Reusable helper functions (formatDate, etc.)
│   ├── index.css            # Tailwind CSS entry point + shadcn theme
│   └── main.tsx             # Application entry point
├── .env.example             # Environment variable template
├── .prettierrc              # Prettier config
├── .prettierignore          # Prettier ignore rules
├── components.json          # shadcn/ui configuration
├── eslint.config.js         # ESLint configuration
├── tsconfig.app.json        # TypeScript config for src/
└── vite.config.ts           # Vite configuration
```

---

## 4. Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Variables | `camelCase` | `taskList`, `isLoading` |
| Functions | `camelCase` | `fetchTasks`, `formatDate` |
| Components | `PascalCase` | `TaskCard`, `UserAvatar` |
| Component files | `PascalCase.tsx` | `TaskCard.tsx` |
| Non-component files | `kebab-case.ts` | `http-client.ts`, `query-client.ts` |
| Folders | `kebab-case` | `task-list/`, `audit-logs/` |
| Types / Interfaces | `PascalCase` | `Task`, `CreateTaskPayload` |
| Zod schemas | `camelCase` + `Schema` suffix | `createTaskSchema`, `loginSchema` |
| Constants | `UPPER_SNAKE_CASE` | `QUERY_KEYS`, `API_MESSAGES` |
| Custom hooks | `use` prefix | `useTasks`, `useCreateTask` |

---

## 5. Validation Rules

- All form inputs **must** use `zod` for schema validation.
- Integrate Zod with React Hook Form via `@hookform/resolvers/zod`.
- Define schemas in `features/[feature]/schemas/` (e.g., `createTaskSchema.ts`).
- Validate API request payloads before sending.

**Example:**

```ts
// features/tasks/schemas/createTaskSchema.ts
import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
```

---

## 6. Environment Variable Rules

- All env values must be accessed through `src/config/env.ts`.
- **Never** use `import.meta.env.VITE_*` directly in components or services.
- All env variables must be prefixed with `VITE_` to be exposed to the browser.
- Copy `.env.example` to `.env` and fill in values locally. Never commit `.env`.

**Available variables:**

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

**Access pattern:**

```ts
// ✅ Correct
import env from '@/config/env'
const url = env.apiBaseUrl

// ❌ Incorrect — never do this
const url = import.meta.env.VITE_API_BASE_URL
```

---

## 7. State Management Rules

| State Type | Solution | When to Use |
|-----------|---------|-------------|
| Server state | `@tanstack/react-query` | Data from API (lists, details, mutations) |
| UI state | `React.useState` / `useReducer` | Local component state (modals, toggles, forms) |
| Form state | `react-hook-form` | Form inputs, validation, submission |

- **Do not** use Zustand or any global store for now.
- **Do not** use React Context for server data — use TanStack Query instead.
- Define query keys in `shared/constants/queryKeys.ts`.

**Query key pattern:**

```ts
// shared/constants/queryKeys.ts
export const QUERY_KEYS = {
  tasks: {
    all: ['tasks'] as const,
    detail: (id: string) => ['tasks', id] as const,
  },
}
```

---

## 8. API Client Rules

- Use `src/shared/lib/http-client.ts` (Axios instance) for all API calls.
- **Never** create a new `axios` instance outside of `http-client.ts`.
- Place API call functions in `features/[feature]/services/`.
- Always type the response using TypeScript generics.

### 8.1 Envelope unwrapping

Every backend endpoint returns the standardized envelope
`{ success, message, data, error? }` (see
`docs/API_DOCUMENTATION.md` §"Conventions"). Service functions
**must** unwrap this envelope before returning to hooks — hooks
should never see the envelope. Use the shared helper:

```ts
import { extractApiData } from '@/shared/lib/api-helpers'

const response = await httpClient.get('/tasks', { params })
return extractApiData<Task[]>(response)
```

### 8.2 Error normalization

Use `extractApiError(error)` inside `onError` handlers to normalize
anything thrown by a service into an `ApiError` instance. The
`ApiError` class (in `src/shared/lib/api-helpers.ts`) extends
`Error` and carries:

| Field      | Source                                                |
|------------|-------------------------------------------------------|
| `message`  | `response.data.message` (backend human-readable)      |
| `code`     | `response.data.error.code` (machine-readable, e.g. `TASK_NOT_FOUND`, `INVALID_STATUS_TRANSITION`) |
| `status`   | HTTP status from axios (`response.status`)            |
| `details`  | `response.data.error.details` (Zod issues, etc.)      |

For network errors (no `response`), `code` falls back to
`'NETWORK_ERROR'` and `status` is `0`.

**Example (mutation):**

```ts
// features/tasks/hooks/use-create-task.ts
import { extractApiError } from '@/shared/lib/api-helpers'
import { MESSAGES } from '@/shared/constants/messages'

onError: (error) => {
  toast.error(extractApiError(error).message || MESSAGES.generic.somethingWrong)
}
```

Use `ApiError.code` to branch on specific backend errors (for
example, render a "not found" state on `TASK_NOT_FOUND`).

**Example (service):**

```ts
// features/tasks/services/taskService.ts
import httpClient from '@/shared/lib/http-client'
import { extractApiData } from '@/shared/lib/api-helpers'
import type { Task } from '../types/task'

export const taskService = {
  getActiveTasks: async (): Promise<Task[]> => {
    const response = await httpClient.get('/tasks')
    return extractApiData<Task[]>(response)
  },
}
```

---

## 9. Component Reusability Rules

- Components used across more than one feature must go in `src/shared/components/`.
- shadcn/ui components in `src/components/ui/` are auto-generated — **do not edit them manually**. Re-run `npx shadcn@latest add [component]` to regenerate.
- Feature-specific components go in `features/[feature]/components/`.
- Page-level components go in `src/pages/`.
- All components must be typed with explicit props using TypeScript interfaces.

**Component structure template:**

```tsx
// shared/components/StatusBadge.tsx
interface StatusBadgeProps {
  status: 'pending' | 'in_progress' | 'done'
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // ...
}
```

---

## 10. Routing Rules

- Use `react-router-dom` for client-side routing.
- Define route configuration in `src/app/router.tsx`.
- Keep the initial router setup minimal.
- Page-level files will be created later when page structure is finalized.
- Do not put business logic directly inside route definitions.
- Use route params only for identifiers such as `taskId` when detail pages are implemented later.

---

## 11. Pre-Review Checklist

Before marking a pull request as ready for review, ensure:

- [ ] All variables and functions use English naming.
- [ ] No hardcoded API URLs or configuration values.
- [ ] All form inputs have Zod schema validation.
- [ ] ESLint passes: `npm run lint`
- [ ] TypeScript compiles: `npm run build`
- [ ] Prettier is applied: `npm run format:check`
- [ ] No unused imports or variables.
- [ ] Components are placed in the correct folder.
- [ ] Reusable logic is extracted into helpers or hooks.
- [ ] Toast messages are clear and consistent.
- [ ] The feature is responsive on mobile and desktop.

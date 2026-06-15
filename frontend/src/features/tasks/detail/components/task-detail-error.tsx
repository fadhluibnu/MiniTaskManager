import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ApiError } from '@/shared/lib/api-helpers'

interface TaskDetailErrorProps {
  error: ApiError
  onRetry: () => void
}

/**
 * Full-page error state for `TaskDetailPage`. Renders when `useTask`
 * threw an error that was NOT a `TASK_NOT_FOUND` 404 — i.e. the
 * backend is unreachable or returned a 5xx. 404s are mapped to
 * `task: null` inside the hook and render the dedicated
 * `TaskNotFound` state instead.
 */
export default function TaskDetailError({ error, onRetry }: TaskDetailErrorProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
        !
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">Failed to load task</h2>
      <p className="mt-2 text-sm text-slate-500">
        {error.message || 'Something went wrong while loading this task.'}
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Button
          type="button"
          onClick={onRetry}
          className="h-10 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800"
        >
          Retry
        </Button>
        <Link
          to="/tasks"
          className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-slate-50"
        >
          Back to Tasks
        </Link>
      </div>
    </section>
  )
}

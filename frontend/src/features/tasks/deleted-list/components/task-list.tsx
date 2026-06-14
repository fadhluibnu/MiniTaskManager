import type { Task } from '../../types/task'
import DeletedTaskCard from './task-card'

interface DeletedTaskListProps {
  tasks: Task[]
  totalCount: number
  isLoading: boolean
  searchQuery: string
}

function DeletedTaskListSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-dashed border-slate-200 p-8 text-center"
    >
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      <p className="mt-3 text-sm text-slate-500">Loading deleted tasks...</p>
    </div>
  )
}

function DeletedTaskEmptyState({
  searchQuery,
  totalCount,
}: {
  searchQuery: string
  totalCount: number
}) {
  const isSearchResult = searchQuery.trim().length > 0 && totalCount > 0
  return (
    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        —
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-950">
        {isSearchResult ? 'No matching deleted tasks' : 'No deleted tasks'}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {isSearchResult
          ? 'Try another keyword or clear the search.'
          : 'Deleted tasks will appear here after a task is soft deleted.'}
      </p>
    </div>
  )
}

export default function DeletedTaskList({
  tasks,
  totalCount,
  isLoading,
  searchQuery,
}: DeletedTaskListProps) {
  if (isLoading) return <DeletedTaskListSkeleton />
  if (tasks.length === 0)
    return <DeletedTaskEmptyState searchQuery={searchQuery} totalCount={totalCount} />

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <DeletedTaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}

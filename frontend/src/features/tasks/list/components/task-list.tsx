import type { Task } from '../../types/task'
import TaskCard from './task-card'

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  isActionDisabled: boolean
  searchQuery: string
  onMove: (task: Task) => void
  onDelete: (task: Task) => void
}

function TaskListSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-xl border border-dashed border-slate-200 p-8 text-center"
    >
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
      <p className="mt-3 text-sm text-slate-500">Loading active tasks...</p>
    </div>
  )
}

function TaskEmptyState({ searchQuery }: { searchQuery: string }) {
  const isSearching = searchQuery.trim().length > 0
  return (
    <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        +
      </div>
      <h3 className="mt-4 text-sm font-semibold text-slate-950">
        {isSearching ? 'No matching tasks' : 'No active tasks'}
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {isSearching
          ? 'Try another keyword or clear the search.'
          : 'Create your first task using the form.'}
      </p>
    </div>
  )
}

export default function TaskList({
  tasks,
  isLoading,
  isActionDisabled,
  onMove,
  onDelete,
  searchQuery,
}: TaskListProps) {
  if (isLoading) return <TaskListSkeleton />
  if (tasks.length === 0) return <TaskEmptyState searchQuery={searchQuery} />

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isActionDisabled={isActionDisabled}
          onMove={onMove}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

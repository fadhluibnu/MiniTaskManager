import { Button } from '@/components/ui/button'
import TaskList from './task-list'
import TaskSearchBar from './task-search-bar'
import type { Task } from '../types/task'

interface ActiveTasksSectionProps {
  tasks: Task[]
  totalCount: number
  isLoading: boolean
  isActionDisabled: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  onClearSearch: () => void
  onRefresh: () => void
  onMove: (taskId: string) => void
  onDelete: (task: Task) => void
}

export default function ActiveTasksSection({
  tasks,
  totalCount,
  isLoading,
  isActionDisabled,
  searchQuery,
  onSearchChange,
  onClearSearch,
  onRefresh,
  onMove,
  onDelete,
}: ActiveTasksSectionProps) {
  const isSearching = searchQuery.trim().length > 0
  const countText = isLoading
    ? 'Loading tasks...'
    : isSearching
      ? `Showing ${tasks.length} of ${totalCount} active tasks`
      : `${totalCount} active task${totalCount === 1 ? '' : 's'}`

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-3 xl:flex-row xl:items-start">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Active Tasks</h2>
          <p className="mt-1 text-sm text-slate-500">{countText}</p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={onRefresh}
          className="h-9 rounded-lg border-slate-200 bg-white px-3 text-xs font-medium text-slate-950 hover:bg-slate-50"
        >
          Refresh
        </Button>
      </div>

      <TaskSearchBar value={searchQuery} onChange={onSearchChange} onClear={onClearSearch} />

      <TaskList
        tasks={tasks}
        totalCount={totalCount}
        isLoading={isLoading}
        isActionDisabled={isActionDisabled}
        searchQuery={searchQuery}
        onMove={onMove}
        onDelete={onDelete}
      />
    </section>
  )
}

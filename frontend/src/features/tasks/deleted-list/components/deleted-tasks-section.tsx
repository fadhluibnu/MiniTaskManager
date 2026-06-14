import { Button } from '@/components/ui/button'
import type { Task } from '../../types/task'
import DeletedTaskList from './task-list'
import DeletedTaskSearchBar from './search-bar'

interface DeletedTasksSectionProps {
  tasks: Task[]
  totalCount: number
  isLoading: boolean
  searchQuery: string
  onSearchChange: (value: string) => void
  onClearSearch: () => void
  onRefresh: () => void
}

export default function DeletedTasksSection({
  tasks,
  totalCount,
  isLoading,
  searchQuery,
  onSearchChange,
  onClearSearch,
  onRefresh,
}: DeletedTasksSectionProps) {
  const isSearching = searchQuery.trim().length > 0
  const countText = isLoading
    ? 'Loading deleted tasks...'
    : isSearching
      ? `Showing ${tasks.length} of ${totalCount} deleted tasks`
      : `${totalCount} deleted task${totalCount === 1 ? '' : 's'}`

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Deleted Task List</h2>
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

      <DeletedTaskSearchBar value={searchQuery} onChange={onSearchChange} onClear={onClearSearch} />

      <DeletedTaskList
        tasks={tasks}
        totalCount={totalCount}
        isLoading={isLoading}
        searchQuery={searchQuery}
      />
    </section>
  )
}

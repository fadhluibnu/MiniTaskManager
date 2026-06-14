import { useEffect, useMemo, useState } from 'react'
import { useStoredActor } from '@/features/actors/hooks/use-stored-actor'
import DeletedTasksSection from '@/features/tasks/deleted-list/components/deleted-tasks-section'
import DeletedListPageHeader from '@/features/tasks/deleted-list/components/page-header'
import { useDeletedTasks } from '@/features/tasks/deleted-list/hooks/use-deleted-tasks'
import { filterDeletedTasks } from '@/features/tasks/deleted-list/utils/filter-deleted-tasks'

export default function DeletedTasksPage() {
  useEffect(() => {
    document.title = 'Deleted Tasks - Mini Task Manager'
  }, [])

  const actor = useStoredActor()
  const { tasks, isLoading, refetch } = useDeletedTasks()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTasks = useMemo(() => filterDeletedTasks(tasks, searchQuery), [tasks, searchQuery])

  return (
    <main
      className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(15, 23, 42, 0.04), transparent 28rem), #f8fafc',
      }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <DeletedListPageHeader actor={actor} />

        <DeletedTasksSection
          tasks={filteredTasks}
          totalCount={tasks.length}
          isLoading={isLoading}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => {
            setSearchQuery('')
          }}
          onRefresh={() => {
            void refetch()
          }}
        />
      </div>
    </main>
  )
}

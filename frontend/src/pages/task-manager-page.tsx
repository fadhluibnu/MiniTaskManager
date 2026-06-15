import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useStoredActor } from '@/features/actors/hooks/use-stored-actor'
import { MESSAGES } from '@/shared/constants/messages'
import ActiveTasksSection from '@/features/tasks/list/components/active-tasks-section'
import CreateTaskForm from '@/features/tasks/list/components/create-task-form'
import DeleteTaskDialog from '@/features/tasks/components/delete-task-dialog'
import PageHeader from '@/features/tasks/list/components/page-header'
import { useCreateTask } from '@/features/tasks/list/hooks/use-create-task'
import { useDeleteTask } from '@/features/tasks/hooks/use-delete-task'
import { useTasks } from '@/features/tasks/list/hooks/use-tasks'
import { useUpdateTaskStatus } from '@/features/tasks/hooks/use-update-task-status'
import type { CreateTaskInput } from '@/features/tasks/schemas/create-task-schema'
import type { Task } from '@/features/tasks/types/task'

export default function TaskManagerPage() {
  useEffect(() => {
    document.title = 'Task Manager - Mini Task Manager'
  }, [])

  const actor = useStoredActor()
  const hasActor = actor !== null
  const [searchQuery, setSearchQuery] = useState('')
  const { tasks, isLoading, refetch } = useTasks({ search: searchQuery })
  const { mutate: createTask, isPending: isCreating } = useCreateTask()
  const { mutate: updateStatus } = useUpdateTaskStatus()
  const { mutate: deleteTask } = useDeleteTask()

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  const handleCreate = useCallback(
    (input: CreateTaskInput) => {
      if (!actor) {
        toast.error(MESSAGES.actor.required)
        return
      }
      createTask({ actor, input })
    },
    [actor, createTask]
  )

  const handleMove = useCallback(
    (task: Task) => {
      if (!actor) {
        toast.error(MESSAGES.actor.required)
        return
      }
      updateStatus({ task, actor })
    },
    [actor, updateStatus]
  )

  const handleDeleteRequest = useCallback(
    (task: Task) => {
      if (!actor) {
        toast.error(MESSAGES.actor.required)
        return
      }
      setTaskToDelete(task)
    },
    [actor]
  )

  const handleDeleteConfirm = useCallback(() => {
    if (!taskToDelete || !actor) return
    deleteTask({ taskId: taskToDelete.id, actor })
    setTaskToDelete(null)
  }, [actor, deleteTask, taskToDelete])

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  return (
    <main
      className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(15, 23, 42, 0.04), transparent 28rem), #f8fafc',
      }}
    >
      <div className="mx-auto max-w-6xl space-y-6">
        <PageHeader actor={actor} />

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <CreateTaskForm
            onSubmit={handleCreate}
            isSubmitting={isCreating}
            isDisabled={!hasActor}
          />

          <ActiveTasksSection
            tasks={tasks}
            isLoading={isLoading}
            isActionDisabled={!hasActor}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={handleClearSearch}
            onRefresh={() => {
              void refetch()
            }}
            onMove={handleMove}
            onDelete={handleDeleteRequest}
          />
        </div>
      </div>

      {taskToDelete && (
        <DeleteTaskDialog
          task={taskToDelete}
          onCancel={() => setTaskToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </main>
  )
}

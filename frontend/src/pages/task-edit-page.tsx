import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useStoredActor } from '@/features/actors/hooks/use-stored-actor'
import ActorBadge from '@/features/actors/components/actor-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { MESSAGES } from '@/shared/constants/messages'
import { useTask } from '@/features/tasks/detail/hooks/use-task'
import { useUpdateTask } from '@/features/tasks/hooks/use-update-task'
import { editTaskSchema, type EditTaskFormValues } from '@/features/tasks/schemas/edit-task-schema'

export default function TaskEditPage() {
  useEffect(() => {
    document.title = 'Edit Task - Mini Task Manager'
  }, [])

  const { taskId } = useParams<{ taskId: string }>()
  const navigate = useNavigate()
  const actor = useStoredActor()

  const { task, isLoading } = useTask(taskId ?? '')
  const { mutate, isPending } = useUpdateTask()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditTaskFormValues>({
    resolver: zodResolver(editTaskSchema),
    defaultValues: { title: '', description: '' },
  })

  // Pre-fill form once task data is loaded
  useEffect(() => {
    if (task) {
      reset({ title: task.title, description: task.description ?? '' })
    }
  }, [task, reset])

  const onSubmit = (values: EditTaskFormValues) => {
    if (!task || !actor) {
      toast.error(MESSAGES.actor.required)
      return
    }

    const trimmedDescription = values.description?.trim()
    mutate(
      {
        taskId: task.id,
        actorId: actor.id,
        title: values.title,
        description: trimmedDescription ? trimmedDescription : undefined,
      },
      {
        onSuccess: () => {
          navigate(`/tasks/${task.id}`)
        },
      }
    )
  }

  const isActorMissing = actor === null

  return (
    <main
      className="min-h-screen px-4 py-6 sm:px-6 lg:px-8"
      style={{
        background:
          'radial-gradient(circle at top left, rgba(15, 23, 42, 0.04), transparent 28rem), #f8fafc',
      }}
    >
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:flex-row lg:items-center">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Link
                to={taskId ? `/tasks/${taskId}` : '/tasks'}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-950 transition hover:bg-slate-50"
              >
                ← Back to Task
              </Link>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                Editing
              </span>
            </div>

            <p className="text-sm font-medium text-slate-500">Mini Task Manager</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Edit Task</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Update the title or description. Status changes use the dedicated status action.
            </p>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <ActorBadge actor={actor} />
          </div>
        </header>

        {/* Form card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
              <p className="ml-3 text-sm text-slate-500">Loading task...</p>
            </div>
          ) : !task ? (
            <div className="py-12 text-center">
              <p className="text-sm font-medium text-slate-700">Task not found.</p>
              <Link
                to="/tasks"
                className="mt-3 inline-flex h-9 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-medium text-slate-950 hover:bg-slate-50"
              >
                Back to Tasks
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div>
                <p className="mb-4 text-xs text-slate-500">
                  Editing:{' '}
                  <span className="font-medium text-slate-800">
                    &quot;{task.title}&quot;
                  </span>{' '}
                  &mdash; Status:{' '}
                  <span className="font-medium text-slate-800">{task.status}</span>
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="editTitle" className="text-sm font-medium text-slate-950">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  id="editTitle"
                  type="text"
                  maxLength={120}
                  placeholder="Example: Prepare sprint report"
                  className="h-11 rounded-lg border-slate-300 bg-white px-3 text-sm placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-slate-200"
                  aria-invalid={Boolean(errors.title)}
                  disabled={isPending}
                  {...register('title')}
                />
                {errors.title && (
                  <p className="text-xs text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="editDescription" className="text-sm font-medium text-slate-950">
                  Description{' '}
                  <span className="text-xs font-normal text-slate-400">(optional)</span>
                </label>
                <Textarea
                  id="editDescription"
                  rows={5}
                  maxLength={400}
                  placeholder="Optional task description"
                  className="resize-none rounded-lg border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-slate-200"
                  disabled={isPending}
                  {...register('description')}
                />
              </div>

              {isActorMissing && (
                <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  {MESSAGES.actor.required} —{' '}
                  <Link to="/select-actor" className="underline underline-offset-2">
                    select an actor
                  </Link>{' '}
                  first.
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <Link
                  to={taskId ? `/tasks/${taskId}` : '/tasks'}
                  className="inline-flex h-11 flex-1 items-center justify-center rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-950 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>
                <Button
                  type="submit"
                  disabled={isActorMissing || isPending}
                  className="h-11 flex-1 rounded-lg bg-slate-950 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}

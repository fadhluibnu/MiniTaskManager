import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { createTaskSchema, type CreateTaskInput } from '../../schemas/create-task-schema'

interface CreateTaskFormProps {
  onSubmit: (input: CreateTaskInput) => void
  isSubmitting: boolean
  isDisabled: boolean
}

export default function CreateTaskForm({
  onSubmit,
  isSubmitting,
  isDisabled,
}: CreateTaskFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: '', description: '' },
  })

  const submit = (data: CreateTaskInput) => {
    onSubmit(data)
    reset()
  }

  return (
    <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight">Create Task</h2>
        <p className="mt-1 text-sm text-slate-500">
          New tasks always start with <span className="font-medium text-slate-900">to_do</span>{' '}
          status.
        </p>
      </div>

      <form onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
        <div className="space-y-2">
          <label htmlFor="taskTitle" className="text-sm font-medium text-slate-950">
            Title
          </label>
          <Input
            id="taskTitle"
            type="text"
            maxLength={120}
            placeholder="Example: Prepare sprint report"
            className="h-11 rounded-lg border-slate-300 bg-white px-3 text-sm placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-slate-200"
            aria-invalid={Boolean(errors.title)}
            disabled={isDisabled}
            {...register('title')}
          />
          {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="taskDescription" className="text-sm font-medium text-slate-950">
            Description
          </label>
          <Textarea
            id="taskDescription"
            rows={4}
            maxLength={400}
            placeholder="Optional task description"
            className="resize-none rounded-lg border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-slate-200"
            disabled={isDisabled}
            {...register('description')}
          />
        </div>

        <Button
          type="submit"
          disabled={isDisabled || isSubmitting}
          className="h-11 w-full rounded-lg bg-slate-950 text-sm font-medium text-white hover:bg-slate-800"
        >
          {isSubmitting ? 'Creating...' : 'Create Task'}
        </Button>
      </form>

      <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Status Flow</p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-slate-950 px-2.5 py-1 font-medium text-white">
            to_do
          </span>
          <span className="text-slate-400">→</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
            pending
          </span>
          <span className="text-slate-400">→</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
            in_progress
          </span>
          <span className="text-slate-400">→</span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
            done
          </span>
        </div>
      </div>
    </section>
  )
}

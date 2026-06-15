import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useStoredActor } from '@/features/actors/hooks/use-stored-actor'
import { MESSAGES } from '@/shared/constants/messages'
import { useUpdateTask } from '../hooks/use-update-task'
import { editTaskSchema, type EditTaskFormValues } from '../schemas/edit-task-schema'
import type { Task } from '../types/task'

interface TaskEditDialogProps {
  task: Task | null
  onOpenChange: (open: boolean) => void
}

/**
 * Reusable edit dialog shared by the Task Manager page and the Task
 * Detail page. Controlled by a `task: Task | null` prop — the dialog
 * is open when `task !== null`, mirroring the `DeleteTaskDialog`
 * pattern.
 *
 * Owns its own form state (React Hook Form) and the update mutation.
 * Status cannot be edited through this dialog; only `title` and
 * `description`.
 */
export default function TaskEditDialog({ task, onOpenChange }: TaskEditDialogProps) {
  const actor = useStoredActor()
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

  // Reset the form whenever the dialog opens for a (potentially
  // different) task. Without this, opening Edit on task B after task A
  // would still show task A's values.
  useEffect(() => {
    if (task) {
      reset({ title: task.title, description: task.description ?? '' })
    }
  }, [task, reset])

  const onSubmit = (values: EditTaskFormValues) => {
    if (!task || !actor) return

    const trimmedDescription = values.description?.trim()
    mutate(
      {
        taskId: task.id,
        actorId: actor.id,
        title: values.title,
        // Empty trimmed description is sent as `undefined` so the
        // backend can clear it; any non-empty value is sent as-is.
        description: trimmedDescription ? trimmedDescription : undefined,
      },
      {
        onSuccess: () => onOpenChange(false),
      }
    )
  }

  const isActorMissing = actor === null

  return (
    <Dialog
      open={task !== null}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false)
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the title or description of{' '}
            <span className="font-medium text-foreground">{task ? `"${task.title}"` : ''}</span>.
            Status changes use the dedicated status action.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <label htmlFor="editTaskTitle" className="text-sm font-medium text-slate-950">
              Title
            </label>
            <Input
              id="editTaskTitle"
              type="text"
              maxLength={120}
              placeholder="Example: Prepare sprint report"
              className="h-11 rounded-lg border-slate-300 bg-white px-3 text-sm placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-slate-200"
              aria-invalid={Boolean(errors.title)}
              disabled={isPending}
              {...register('title')}
            />
            {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="editTaskDescription" className="text-sm font-medium text-slate-950">
              Description
            </label>
            <Textarea
              id="editTaskDescription"
              rows={4}
              maxLength={400}
              placeholder="Optional task description"
              className="resize-none rounded-lg border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-slate-200"
              disabled={isPending}
              {...register('description')}
            />
          </div>

          {isActorMissing && <p className="text-xs text-red-600">{MESSAGES.actor.required}</p>}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isActorMissing || isPending}
              className="bg-slate-950 text-white hover:bg-slate-800"
            >
              {isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

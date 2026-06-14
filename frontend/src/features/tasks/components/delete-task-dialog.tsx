import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Task } from '../types/task'

interface DeleteTaskDialogProps {
  task: Task | null
  onCancel: () => void
  onConfirm: () => void
}

export default function DeleteTaskDialog({ task, onCancel, onConfirm }: DeleteTaskDialogProps) {
  return (
    <Dialog open={task !== null} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure? This action will move the task{' '}
            <span className="font-medium text-foreground">{task ? `"${task.title}"` : ''}</span> to
            deleted tasks.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

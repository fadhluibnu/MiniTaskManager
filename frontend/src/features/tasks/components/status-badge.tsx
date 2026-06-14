import { cn } from '@/lib/utils'
import type { TaskStatus } from '../types/task-status'
import { formatStatus } from '../utils/format-status'

interface StatusBadgeProps {
  status: TaskStatus
}

const STATUS_CLASSES: Record<TaskStatus, string> = {
  to_do: 'bg-slate-100 text-slate-700',
  pending: 'bg-amber-100 text-amber-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-emerald-100 text-emerald-800',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', STATUS_CLASSES[status])}>
      {formatStatus(status)}
    </span>
  )
}

import { cn } from '@/lib/utils'
import { TASK_STATUSES, type TaskStatus } from '../../types/task-status'
import { formatStatus } from '../../utils/format-status'

interface StatusFlowDetailProps {
  currentStatus: TaskStatus
}

type StepState = 'completed' | 'current' | 'upcoming'

function getStepState(index: number, currentIndex: number): StepState {
  if (index < currentIndex) return 'completed'
  if (index === currentIndex) return 'current'
  return 'upcoming'
}

function getStepDescription(state: StepState): string {
  switch (state) {
    case 'completed':
      return 'Task has passed this step.'
    case 'current':
      return 'Task is currently here.'
    case 'upcoming':
      return 'Waiting for previous status.'
  }
}

function getIndicatorClasses(state: StepState): string {
  switch (state) {
    case 'current':
      return 'bg-slate-950 text-white'
    case 'completed':
      return 'bg-emerald-100 text-emerald-800'
    case 'upcoming':
      return 'bg-slate-100 text-slate-600'
  }
}

function getIndicatorLabel(state: StepState): string {
  switch (state) {
    case 'current':
      return 'Current'
    case 'completed':
      return 'Passed'
    case 'upcoming':
      return 'Next'
  }
}

export default function StatusFlowDetail({ currentStatus }: StatusFlowDetailProps) {
  const currentIndex = TASK_STATUSES.indexOf(currentStatus)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight">Status Flow</h2>
        <p className="mt-1 text-sm text-slate-500">Status can only move forward in one step.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        {TASK_STATUSES.map((status, index) => {
          const state = getStepState(index, currentIndex)
          return (
            <div
              key={status}
              className={cn(
                'rounded-xl border p-4',
                state === 'current' ? 'border-slate-950 bg-slate-50' : 'border-slate-200 bg-white'
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-950">{formatStatus(status)}</span>
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-medium',
                    getIndicatorClasses(state)
                  )}
                >
                  {getIndicatorLabel(state)}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">{getStepDescription(state)}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

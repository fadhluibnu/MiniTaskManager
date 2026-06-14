import { getInitials } from '@/shared/utils/get-initials'
import type { ActorCardData } from '../types/actor'

interface ActorBadgeProps {
  actor: ActorCardData | null
}

export default function ActorBadge({ actor }: ActorBadgeProps) {
  const initials = actor ? getInitials(actor.name) : '--'
  const name = actor?.name ?? 'No actor selected'
  const id = actor?.id ?? 'Select actor first'

  return (
    <div className="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white">
        {initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-slate-950">{name}</p>
        <p className="truncate text-xs text-slate-500">{id}</p>
      </div>
    </div>
  )
}

import { Badge } from '@/components/ui/badge'
import { getInitials } from '@/shared/utils/get-initials'
import type { ActorCardData } from '../types/actor'

interface ActorCardProps {
  actor: ActorCardData
  isSelected: boolean
  onSelect: (actor: ActorCardData) => void
}

export default function ActorCard({ actor, isSelected, onSelect }: ActorCardProps) {
  return (
    <button
      type="button"
      data-selected={String(isSelected)}
      aria-pressed={isSelected}
      onClick={() => onSelect(actor)}
      className="actor-card flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm outline-none focus:ring-2 focus:ring-slate-200"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
        {getInitials(actor.name)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-slate-950">{actor.name}</p>
          {isSelected && <Badge variant="default">Selected</Badge>}
        </div>

        <p className="mt-1 truncate text-xs text-slate-500">{actor.id}</p>
        <p className="mt-1 truncate text-xs text-slate-500">{actor.role}</p>
      </div>

      <span className="radio-dot h-5 w-5 shrink-0 rounded-full border border-slate-200 bg-white" />
    </button>
  )
}

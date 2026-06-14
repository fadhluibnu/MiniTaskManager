import { getInitials } from '@/shared/utils/get-initials'
import type { ActorCardData } from '../types/actor'

interface SelectedActorBoxProps {
  actor: ActorCardData | null
}

export default function SelectedActorBox({ actor }: SelectedActorBoxProps) {
  if (!actor) return null

  return (
    <section className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Selected Actor</p>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-semibold text-white">
          {getInitials(actor.name)}
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">{actor.name}</p>
          <p className="mt-0.5 truncate text-xs text-slate-500">{actor.id}</p>
        </div>
      </div>
    </section>
  )
}

import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useActors } from '@/features/actors/hooks/use-actors'
import { useSelectedActor } from '@/features/actors/hooks/use-selected-actor'
import ActorList from '@/features/actors/components/actor-list'
import ActorListSkeleton from '@/features/actors/components/actor-list-skeleton'
import SelectedActorBox from '@/features/actors/components/selected-actor-box'

export default function SelectActorPage() {
  const { actors, isLoading, isUsingFallback } = useActors()
  const { selectedActor, selectActor, clearSelection } = useSelectedActor(actors)
  const navigate = useNavigate()

  const handleContinue = () => {
    if (!selectedActor) return
    navigate('/tasks')
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        background:
          'radial-gradient(circle at top, rgba(15, 23, 42, 0.04), transparent 24rem), #f8fafc',
      }}
    >
      <section className="w-full max-w-[420px] rounded-2xl border border-slate-200 bg-card p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <header className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">Choose Actor</h1>
            <p className="mt-2 text-sm text-slate-500">Select one actor to continue.</p>
          </div>

          <Badge
            variant="secondary"
            className="mt-1 rounded-full bg-slate-100 px-3 py-1 text-slate-900"
          >
            Required
          </Badge>
        </header>

        {isUsingFallback && (
          <div
            role="status"
            className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
          >
            Backend is not available. Using local fallback actor data.
          </div>
        )}

        {isLoading ? (
          <ActorListSkeleton />
        ) : (
          <ActorList actors={actors} selectedActor={selectedActor} onSelect={selectActor} />
        )}

        <SelectedActorBox actor={selectedActor} />

        <div className="mt-6 grid grid-cols-[1fr_auto] gap-3">
          <Button
            type="button"
            onClick={handleContinue}
            disabled={!selectedActor}
            className="h-11 rounded-lg bg-slate-950 px-4 text-sm font-medium text-white hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50"
          >
            Continue to Tasks
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={clearSelection}
            className="h-11 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 hover:bg-slate-50"
          >
            Clear
          </Button>
        </div>

        <p className="mt-5 text-xs leading-5 text-slate-500">
          The selected actor is saved in localStorage and will be used by the next pages to send
          actorId to the backend API.
        </p>
      </section>
    </main>
  )
}

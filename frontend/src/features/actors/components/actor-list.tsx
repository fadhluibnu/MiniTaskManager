import type { ActorCardData } from '../types/actor'
import ActorCard from './actor-card'

interface ActorListProps {
  actors: ActorCardData[]
  selectedActor: ActorCardData | null
  onSelect: (actor: ActorCardData) => void
}

export default function ActorList({ actors, selectedActor, onSelect }: ActorListProps) {
  return (
    <div className="space-y-3">
      {actors.map((actor) => (
        <ActorCard
          key={actor.id}
          actor={actor}
          isSelected={selectedActor?.id === actor.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

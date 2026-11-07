import type { CharacterSummary } from "@/modules/game-data/domain/character"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { ResonatorItem } from "@/modules/panel/user/resonator-selector/components/resonator-item"
import { useSuspenseQuery } from "@tanstack/react-query"

interface ResonatorListProps {
  pendingId: number | null
  onSelect: (resonator: CharacterSummary) => void
  onPreload?: (resonator: CharacterSummary) => void
}

/** Resonator grid used by the builder selector. */
export function ResonatorList({
  pendingId,
  onSelect,
  onPreload,
}: ResonatorListProps) {
  const { data: resonators } = useSuspenseQuery(characterQueries.list())
  const isBusy = pendingId !== null

  if (resonators.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay resonadores en el catálogo.
      </p>
    )
  }

  return (
    <ul className="grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8">
      {resonators.map((resonator) => (
        <li key={resonator.id}>
          <ResonatorItem
            resonator={resonator}
            isPending={resonator.id === pendingId}
            isBusy={isBusy}
            onSelect={onSelect}
            onPreload={onPreload}
          />
        </li>
      ))}
    </ul>
  )
}

import { useSuspenseQuery } from "@tanstack/react-query"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { ResonatorItem } from "./resonator-item"

interface ResonatorSelectorProps {
  buildId: string
  onSelect?: () => void
}

export function ResonatorSelector({
  onSelect,
  buildId,
}: ResonatorSelectorProps) {
  const { data: resonators } = useSuspenseQuery(characterQueries.list())

  return (
    <div className="grid w-full grid-cols-8 gap-4">
      {resonators.map((resonator) => (
        <ResonatorItem
          buildId={buildId}
          resonator={resonator}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

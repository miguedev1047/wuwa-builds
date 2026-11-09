import { useSuspenseQuery } from "@tanstack/react-query"
import { cn } from "cn"
import { characterQueries } from "@/modules/game-data/queries/characters"
import {
  resonatorGridVariants,
  type ResonatorGridColumns,
} from "@/modules/panel/user/builder/components/resonator-selector/resonator-grid-variants"
import {
  ResonatorItem,
  type ResonatorAspect,
} from "@/modules/panel/user/builder/components/resonator-selector/resonator-item"

interface ResonatorGridProps {
  buildId: string
  onSelect?: () => void
  columns?: ResonatorGridColumns
  aspect?: ResonatorAspect
  className?: string
}

/** Resonator grid shared by the builder list and the selector dialog. */
export function ResonatorGrid({
  buildId,
  onSelect,
  columns,
  aspect = "portrait",
  className,
}: ResonatorGridProps) {
  const { data: resonators } = useSuspenseQuery(characterQueries.list())

  if (resonators.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No hay resonadores en el catálogo.
      </p>
    )
  }

  return (
    <ul className={cn(resonatorGridVariants({ columns }), className)}>
      {resonators.map((resonator) => (
        <li key={resonator.id} className="min-w-0">
          <ResonatorItem
            buildId={buildId}
            resonator={resonator}
            aspect={aspect}
            onSelect={onSelect}
          />
        </li>
      ))}
    </ul>
  )
}

export { resonatorGridVariants, type ResonatorGridColumns }

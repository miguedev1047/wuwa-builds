import { useSuspenseQuery } from "@tanstack/react-query"
import { cn } from "cn"
import { characterQueries } from "@/modules/game-data/queries/characters"
import {
  ResonatorItem,
  type ResonatorAspect,
} from "@/modules/panel/user/builder/components/resonator-selector/resonator-item"
import { cva, type VariantProps } from "class-variance-authority"

export const resonatorGridVariants = cva("grid w-full", {
  variants: {
    columns: {
      4: "grid-cols-2 gap-4 sm:grid-cols-4",
      6: "grid-cols-3 gap-3 sm:grid-cols-6",
      8: "grid-cols-4 gap-2 sm:grid-cols-8",
      10: "grid-cols-4 gap-2 sm:grid-cols-10",
    },
  },
  defaultVariants: {
    columns: 8,
  },
})

export type ResonatorGridColumns = NonNullable<
  VariantProps<typeof resonatorGridVariants>["columns"]
>

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

import { useSuspenseQuery } from "@tanstack/react-query"
import { useBuildCollection } from "@/modules/panel/user/builds/application/build-live-queries"
import { characterQueries } from "@/modules/game-data/queries/characters"
import {
  BuildCatalogPicker,
  type BuildCatalogPickerColumns,
} from "../../ui/build-catalog-picker"
import { ResonatorItem, type ResonatorAspect } from "./resonator-item"

export type ResonatorGridColumns = BuildCatalogPickerColumns

interface ResonatorGridProps {
  buildId: string
  onSelect?: () => void
  columns?: ResonatorGridColumns
  aspect?: ResonatorAspect
  className?: string
}

/** Resonator adapter of the shared catalog picker. */
export function ResonatorGrid({
  buildId,
  onSelect,
  columns,
  aspect = "portrait",
  className,
}: ResonatorGridProps) {
  const { data: resonators } = useSuspenseQuery(characterQueries.list())
  const { data: build } = useBuildCollection({ buildId })
  const selectedId = build?.resonator.data?.id

  return (
    <BuildCatalogPicker
      items={resonators}
      getItemKey={(resonator) => resonator.id}
      columns={columns}
      className={className}
      emptyMessage="No hay resonadores en el catálogo."
    >
      {(resonator) => (
        <ResonatorItem
          buildId={buildId}
          resonator={resonator}
          aspect={aspect}
          selected={selectedId === resonator.id}
          onSelect={onSelect}
        />
      )}
    </BuildCatalogPicker>
  )
}

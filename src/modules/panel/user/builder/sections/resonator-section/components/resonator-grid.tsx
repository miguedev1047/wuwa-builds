import { useSuspenseQuery } from "@tanstack/react-query"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { characterQueries } from "@game-data/queries/characters"
import {
  BuildCatalogPicker,
  type BuildCatalogPickerColumns,
} from "@builder/ui/build-catalog-picker"
import {
  ResonatorItem,
  type ResonatorAspect,
} from "@builder/sections/resonator-section/components/resonator-item"
import { Suspense } from "react"
import { ResonatorGridLoading } from "@builder/sections/resonator-section/ui-states"

export type ResonatorGridColumns = BuildCatalogPickerColumns

interface ResonatorGridProps {
  buildId: string
  onSelect?: () => void
  columns?: ResonatorGridColumns
  aspect?: ResonatorAspect
  className?: string
}

/** Resonator adapter of the shared catalog picker. */
export function ResonatorGrid(props: ResonatorGridProps) {
  return (
    <Suspense fallback={<ResonatorGridLoading columns={props.columns} />}>
      <ResonatorGridLoaded {...props} />
    </Suspense>
  )
}

/** Resonator adapter of the shared catalog picker. */
export function ResonatorGridLoaded({
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

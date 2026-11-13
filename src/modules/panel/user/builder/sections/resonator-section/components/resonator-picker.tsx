import type { BuildProps } from "@builds/domain/build-record"
import { useSuspenseQuery } from "@tanstack/react-query"
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
import { ResonatorPickerLoading } from "@builder/sections/resonator-section/ui-states"

export type ResonatorPickerColumns = BuildCatalogPickerColumns

interface ResonatorPickerProps {
  build: BuildProps
  onSelected?: () => void
  columns?: ResonatorPickerColumns
  aspect?: ResonatorAspect
  className?: string
}

/** Resonator adapter of the shared catalog picker. */
export function ResonatorPicker(props: ResonatorPickerProps) {
  return (
    <Suspense fallback={<ResonatorPickerLoading columns={props.columns} />}>
      <ResonatorPickerLoaded {...props} />
    </Suspense>
  )
}

/** Resonator adapter of the shared catalog picker. */
export function ResonatorPickerLoaded({
  build,
  onSelected,
  columns,
  aspect = "portrait",
  className,
}: ResonatorPickerProps) {
  const { data: resonators } = useSuspenseQuery(characterQueries.list())
  const selectedId = build.resonator.data?.id

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
          buildId={build.buildId}
          resonator={resonator}
          aspect={aspect}
          selected={selectedId === resonator.id}
          onSelect={onSelected}
        />
      )}
    </BuildCatalogPicker>
  )
}

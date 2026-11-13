import { useSuspenseQuery } from "@tanstack/react-query"
import type { EchoesDataProps } from "@builds/domain/build-record"
import { echoQueries } from "@game-data/queries/echoes"
import { useBuilderId } from "@builder/application/use-builder-id"
import { useSelectEcho } from "@builder/application/use-select-echo"
import {
  BuildCatalogPicker,
  BuildCatalogPickerItem,
  type BuildCatalogPickerColumns,
} from "@builder/ui/build-catalog-picker"
import { Suspense } from "react"
import { EchoPickerLoading } from "@builder/sections/echoes-section/ui-states"

export type EchoPickerColumns = BuildCatalogPickerColumns

type EchoPickerProps = {
  slot: EchoesDataProps
  /** Called after the echo is assigned to the slot. */
  onSelected?: () => void
  columns?: EchoPickerColumns
  className?: string
}

/** Catalog picker bound to one echo slot. */
export function EchoPicker(props: EchoPickerProps) {
  return (
    <Suspense fallback={<EchoPickerLoading columns={props.columns} />}>
      <EchoPickerLoaded {...props} />
    </Suspense>
  )
}

export function EchoPickerLoaded({
  slot,
  columns,
  onSelected,
}: EchoPickerProps) {
  const buildId = useBuilderId()
  const { data: echoes } = useSuspenseQuery(echoQueries.list())
  const { selectEcho } = useSelectEcho(buildId)

  return (
    <BuildCatalogPicker
      items={echoes}
      getItemKey={(echo) => echo.id}
      columns={columns}
      emptyMessage="No hay ecos en el catálogo."
    >
      {(echo) => (
        <BuildCatalogPickerItem
          label={echo.name}
          image={echo.icon}
          aspect="square"
          selected={slot.data?.id === echo.id}
          onSelect={() => {
            selectEcho(slot.index, echo)
            onSelected?.()
          }}
        />
      )}
    </BuildCatalogPicker>
  )
}

import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { useSuspenseQuery } from "@tanstack/react-query"
import type { EchoesDataProps } from "@build/domain/build-record"
import { echoQueries } from "@catalog/queries/echoes"
import { useSelectEcho } from "@build/presentation/editor/hooks/use-select-echo"
import {
  BuildCatalogPicker,
  BuildCatalogPickerItem,
  type BuildCatalogPickerColumns,
} from "@build/presentation/components/build-catalog-picker"
import { Suspense } from "react"
import { EchoPickerLoading } from "@build/presentation/editor/sections/echoes-section/ui-states"

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
  const { buildId } = useBuildIdentity()
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

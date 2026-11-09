import { useSuspenseQuery } from "@tanstack/react-query"
import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import { echoQueries } from "@/modules/game-data/queries/echoes"
import { useBuilderId } from "../../../application/use-builder-id"
import { useSelectEcho } from "../../../application/use-select-echo"
import {
  BuildCatalogPicker,
  BuildCatalogPickerItem,
} from "../../../ui/build-catalog-picker"

type EchoPickerProps = {
  slot: EchoesDataProps
  /** Called after the echo is assigned to the slot. */
  onSelected?: () => void
}

/** Catalog picker bound to one echo slot. */
export function EchoPicker({ slot, onSelected }: EchoPickerProps) {
  const buildId = useBuilderId()
  const { data: echoes } = useSuspenseQuery(echoQueries.list())
  const { selectEcho } = useSelectEcho(buildId)

  return (
    <BuildCatalogPicker
      items={echoes}
      getItemKey={(echo) => echo.id}
      columns={4}
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

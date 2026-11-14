import type { BuildProps } from "@build/domain/build-record"
import { useCompatibleWeapons } from "@build/presentation/editor/sections/weapon-section/hooks/use-compatible-weapons"
import { WeaponItem } from "@build/presentation/editor/sections/weapon-section/components/weapon-item"
import {
  BuildCatalogPicker,
  type BuildCatalogPickerColumns,
} from "@build/presentation/components/build-catalog-picker"
import { Suspense } from "react"
import { WeaponPickerLoading } from "@build/presentation/editor/sections/weapon-section/ui-states/weapon-loading"

export type WeaponPickerColumns = BuildCatalogPickerColumns

type WeaponPickerProps = {
  build: BuildProps
  onSelected?: () => void
  columns?: WeaponPickerColumns
  className?: string
}

/** Weapons compatible with the selected resonator, as a dialog grid. */
export function WeaponPicker(props: WeaponPickerProps) {
  return (
    <Suspense fallback={<WeaponPickerLoading columns={props.columns} />}>
      <WeaponPickerLoaded {...props} />
    </Suspense>
  )
}

export function WeaponPickerLoaded({
  build,
  columns,
  onSelected,
}: WeaponPickerProps) {
  const { items, selectedId } = useCompatibleWeapons(build)

  return (
    <BuildCatalogPicker
      items={items}
      getItemKey={(weapon) => weapon.id}
      columns={columns}
      emptyMessage="No hay armas compatibles con el resonador."
    >
      {(weapon) => (
        <WeaponItem
          buildId={build.buildId}
          weapon={weapon}
          selected={weapon.id === selectedId}
          onSelect={onSelected}
        />
      )}
    </BuildCatalogPicker>
  )
}

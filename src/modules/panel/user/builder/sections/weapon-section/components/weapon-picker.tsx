import { useBuilderId } from "@builder/application/use-builder-id"
import { useCompatibleWeapons } from "@builder/sections/weapon-section/application/use-compatible-weapons"
import { WeaponItem } from "@builder/sections/weapon-section/components/weapon-item"
import { BuildCatalogPicker } from "@builder/ui/build-catalog-picker"

type WeaponPickerProps = {
  /** Called after the weapon is applied to the build. */
  onSelected?: () => void
}

/** Weapons compatible with the selected resonator, as a dialog grid. */
export function WeaponPicker({ onSelected }: WeaponPickerProps) {
  const buildId = useBuilderId()
  const { items, selectedId } = useCompatibleWeapons(buildId)

  return (
    <BuildCatalogPicker
      items={items}
      getItemKey={(weapon) => weapon.id}
      columns={6}
      emptyMessage="No hay armas compatibles con el resonador."
    >
      {(weapon) => (
        <WeaponItem
          buildId={buildId}
          weapon={weapon}
          selected={weapon.id === selectedId}
          onSelect={onSelected}
        />
      )}
    </BuildCatalogPicker>
  )
}

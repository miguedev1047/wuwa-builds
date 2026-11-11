import type { WeaponSummary } from "@game-data/domain/weapon"
import { BuildCatalogPickerItem } from "@builder/ui/build-catalog-picker"
import { useSelectWeapon } from "@builder/application/use-select-weapon"

export type WeaponAspect = "square"

interface WeaponItemProps {
  weapon: WeaponSummary
  buildId: string
  aspect?: WeaponAspect
  selected?: boolean
  onSelect?: () => void
}

/** Weapon item of the shared catalog picker. */
export function WeaponItem({
  weapon,
  buildId,
  aspect = "square",
  selected = false,
  onSelect,
}: WeaponItemProps) {
  const { selectWeapon } = useSelectWeapon(buildId)

  const handleSelect = async () => {
    const applied = await selectWeapon(weapon)

    if (applied) onSelect?.()
  }

  return (
    <BuildCatalogPickerItem
      label={weapon.name}
      image={weapon.icon}
      aspect={aspect}
      selected={selected}
      onSelect={handleSelect}
    />
  )
}

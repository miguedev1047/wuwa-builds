import type { WeaponSummary } from "@catalog/domain/weapon"
import { BuildCatalogPickerItem } from "@build/presentation/components/build-catalog-picker"
import { useSelectWeapon } from "@build/presentation/editor/hooks/use-select-weapon"

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

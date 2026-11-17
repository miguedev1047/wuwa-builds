import type { MultiComboboxOption } from "@/components/form/fields/multi-combobox-field"
import type { WeaponSummary } from "@catalog/domain/weapon"
import type { WeaponTypeId } from "@/modules/game-data/domain/categories"

/** Options for catalog weapons compatible with a resonator's weapon type. */
export function compatibleBestWeaponOptions(
  weapons: readonly WeaponSummary[],
  weaponType: WeaponTypeId
): MultiComboboxOption[] {
  return weapons
    .filter((weapon) => weapon.type === weaponType)
    .map((weapon) => ({
      label: weapon.name,
      value: String(weapon.id),
      icon: weapon.icon,
    }))
}

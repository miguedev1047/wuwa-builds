/**
 * Weapon types shared by the admin form and the create server function.
 *
 * `value` is the numeric `WeaponType` Encore returns and the catalog stores in
 * `weapons.type`; `label` is also the display name saved in `weapons.type_name`.
 */
export const WEAPON_TYPES = [
  { label: "Mandoble", value: 1 },
  { label: "Espada", value: 2 },
  { label: "Pistolas", value: 3 },
  { label: "Brazales", value: 4 },
  { label: "Rectificador", value: 5 },
] as const

/** Display name stored in `weapons.type_name` for a numeric weapon type. */
export function weaponTypeName(type: number): string {
  return WEAPON_TYPES.find((item) => item.value === type)?.label ?? ""
}

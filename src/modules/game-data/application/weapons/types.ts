import type { WeaponTypeId } from "@game-data/application/constants/resonator"

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

/** Numeric catalog type of each canonical resonator weapon type. */
export const WEAPON_TYPE_NUMBER: Record<WeaponTypeId, number> = {
  broadblade: 1,
  sword: 2,
  pistols: 3,
  gauntlets: 4,
  rectifier: 5,
}

/** Display name stored in `weapons.type_name` for a numeric weapon type. */
export function weaponTypeName(type: number): string {
  return WEAPON_TYPES.find((item) => item.value === type)?.label ?? ""
}

/** Numeric catalog type of a canonical weapon id, or null when unknown. */
export function weaponTypeNumber(typeId: string): number | null {
  if (!Object.hasOwn(WEAPON_TYPE_NUMBER, typeId)) return null

  return WEAPON_TYPE_NUMBER[typeId as WeaponTypeId]
}

/**
 * Whether a catalog weapon matches the canonical type of a resonator.
 *
 * An unknown resonator type returns true so the picker does not hide every
 * weapon when a new type is added before this map is updated.
 */
export function weaponTypeMatches(
  resonatorType: string,
  weaponType: number
): boolean {
  const expected = weaponTypeNumber(resonatorType)
  return expected === null || expected === weaponType
}

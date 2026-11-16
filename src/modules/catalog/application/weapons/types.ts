import type { WeaponTypeId } from "@catalog/application/constants/resonator"

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
]

/** Numeric catalog type of each canonical resonator weapon type. */
export const WEAPON_TYPE_NUMBER: Record<WeaponTypeId, number> = {
  broadblade: 1,
  sword: 2,
  pistols: 3,
  guantlets: 4,
  rectifier: 5,
}

export const WEAPON_TYPE_KEY: Record<number, WeaponTypeId> = {
  1: "broadblade",
  2: "sword",
  3: "pistols",
  4: "guantlets",
  5: "rectifier",
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
export function weaponTypeKey(typeKey: number): string | null {
  if (!Object.hasOwn(WEAPON_TYPE_KEY, typeKey)) return null

  return WEAPON_TYPE_KEY[typeKey as number]
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

import {
  categoryLabel,
  WEAPON_TYPES,
  WEAPON_TYPE_OPTIONS,
  type WeaponTypeId,
} from "@/modules/game-data/domain/categories"

export { WEAPON_TYPE_OPTIONS as WEAPON_TYPES }

/** Display label of a canonical weapon type. */
export function weaponTypeName(type: WeaponTypeId): string {
  return categoryLabel(WEAPON_TYPES, type)
}

/** Compatibility compares the same category id on both catalog entities. */
export function weaponTypeMatches(
  resonatorType: WeaponTypeId,
  weaponType: WeaponTypeId
): boolean {
  return resonatorType === weaponType
}

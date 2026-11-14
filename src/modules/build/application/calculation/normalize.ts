import {
  ELEMENT_BY_ENCORE,
  isElementId,
  isWeaponTypeId,
  WEAPON_TYPE_BY_ENCORE,
} from "@catalog/application/constants/resonator"

/** Canonical element id from a canonical id or an Encore label. */
export function normalizeElementId(
  value: string | null | undefined
): string | null {
  if (!value) return null
  if (isElementId(value)) return value

  return ELEMENT_BY_ENCORE[value] ?? null
}

/** Canonical weapon type id from a canonical id or an Encore label. */
export function normalizeWeaponTypeId(
  value: string | null | undefined
): string | null {
  if (!value) return null
  if (isWeaponTypeId(value)) return value

  return WEAPON_TYPE_BY_ENCORE[value] ?? null
}

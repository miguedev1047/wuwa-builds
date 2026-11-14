import type { EncoreProperty } from "@encore/domain/property"
import {
  WEAPON_PROPERTY_ALIASES,
  weaponPropertyStatId,
} from "@catalog/application/constants/weapon"

/** Visible fields of the weapon property form. */
export type WeaponPropertyDraft = {
  name: string
  baseValue: number
  icon: string
}

/**
 * Whether the Encore stat is a percentage.
 *
 * Weapons reuse `ATQ` for the flat base attack and for the attack percentage
 * substat, so the growth value (`"8.10%"` vs `"33.00"`) is the only reliable
 * signal.
 */
export function isPercentWeaponProperty(property: EncoreProperty): boolean {
  const levelOne =
    property.growth.find((entry) => entry.level === 1) ?? property.growth[0]
  const first = levelOne?.value

  return typeof first === "string" && first.trim().endsWith("%")
}

function roundToHundredths(value: number): number {
  return Math.round(value * 100) / 100
}

/**
 * Normalizes the Encore base value to percentage points.
 *
 * Encore reports some weapon percentages multiplied by 100 (`Prob. CRIT` 450)
 * and others as a fraction (`PS` 0.1605), so the level-1 growth value — which
 * is already in display units — is the reliable source. Flat stats are kept
 * as-is and the base value is only a fallback.
 */
function normalizeBaseValue(property: EncoreProperty): number {
  if (!isPercentWeaponProperty(property)) return property.baseValue

  const levelOne = property.growth.find((entry) => entry.level === 1)?.value
  const parsed =
    typeof levelOne === "number"
      ? levelOne
      : Number(levelOne?.replace("%", "").trim())

  if (Number.isFinite(parsed)) {
    return roundToHundredths(parsed)
  }

  const value =
    property.baseValue > 1 ? property.baseValue / 100 : property.baseValue * 100

  return roundToHundredths(value)
}

/**
 * Maps an Encore weapon stat to the values of the property form.
 *
 * The panel stores display units (percentage points) and panel labels, so the
 * builder never has to guess whether a value is flat or a percentage.
 */
export function weaponPropertyDraftFromEncore(
  property: EncoreProperty
): WeaponPropertyDraft {
  const percent = isPercentWeaponProperty(property)
  const statId = weaponPropertyStatId(property.name, percent)

  return {
    name: statId ?? (percent ? `${property.name} %` : property.name),
    baseValue: normalizeBaseValue(property),
    icon: property.icon,
  }
}

/** Resolves the Encore stat that matches a saved weapon property stat id. */
export function findEncoreWeaponProperty(
  properties: EncoreProperty[],
  statId: string
): EncoreProperty | undefined {
  const alias = WEAPON_PROPERTY_ALIASES.find((item) => item.statId === statId)

  if (alias) {
    return properties.find(
      (property) =>
        property.name === alias.encoreName &&
        isPercentWeaponProperty(property) === alias.percent
    )
  }

  return properties.find((property) => property.name === statId)
}

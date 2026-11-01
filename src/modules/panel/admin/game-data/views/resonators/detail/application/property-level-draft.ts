import type { EncoreProperty } from "@/modules/encore/domain/property"
import { RESONATOR_PROPERTY_NAMES } from "@/modules/panel/admin/game-data/views/resonators/shared/constants/resonator"

/** Visible fields of the property level form. */
export type PropertyLevelDraft = {
  name: string
  baseValue: number
  icon: string
}

/** Resolves the Encore property that matches a saved property level name. */
export function findEncoreProperty(
  properties: EncoreProperty[],
  name: string
): EncoreProperty | undefined {
  const option = RESONATOR_PROPERTY_NAMES.find((item) => item.value === name)

  return properties.find(
    (property) => property.name === (option?.encoreName ?? name)
  )
}

/**
 * Maps an Encore base stat to the values of the property level form.
 *
 * Encore names stats with abbreviations (`ATQ`, `PS`, ...) and scales
 * percentage stats by 100, so the label and the value are normalized before
 * filling the form. Unknown names are kept as-is.
 */
export function propertyLevelDraftFromEncore(
  property: EncoreProperty
): PropertyLevelDraft {
  const option = RESONATOR_PROPERTY_NAMES.find(
    (candidate) => candidate.encoreName === property.name
  )

  return {
    name: option?.value ?? property.name,
    baseValue: property.baseValue / (option?.encoreScale ?? 1),
    icon: property.icon,
  }
}

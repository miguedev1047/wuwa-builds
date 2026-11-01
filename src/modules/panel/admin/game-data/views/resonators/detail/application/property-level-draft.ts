import type { EncoreProperty } from "@/modules/encore/domain/property"
import { RESONATOR_PROPERTY_NAMES } from "@/modules/panel/admin/game-data/views/resonators/shared/constants/resonator"

/** Visible fields of the property level form. */
export type PropertyLevelDraft = {
  name: string
  baseValue: number
  icon: string
}

/**
 * Maps an Encore base stat to the values of the property level form.
 *
 * Encore names stats with abbreviations (`ATQ`, `PS`, ...), so the label is
 * resolved from `RESONATOR_PROPERTY_NAMES`; unknown names are kept as-is.
 */
export function propertyLevelDraftFromEncore(
  property: EncoreProperty
): PropertyLevelDraft {
  const option = RESONATOR_PROPERTY_NAMES.find(
    (candidate) => candidate.encoreName === property.name
  )

  return {
    name: option?.value ?? property.name,
    baseValue: property.baseValue,
    icon: property.icon,
  }
}

import type { EncoreProperty } from "@encore/domain/property"
import { RESONATOR_PROPERTY_ALIASES } from "@catalog/application/constants/resonator"

/** Visible fields of the property level form. */
export type PropertyLevelDraft = {
  name: string
  baseValue: number
  icon: string
}

/** Resolves the Encore property that matches a saved property stat id. */
export function findEncoreProperty(
  properties: EncoreProperty[],
  statId: string
): EncoreProperty | undefined {
  const alias = RESONATOR_PROPERTY_ALIASES.find(
    (candidate) => candidate.statId === statId
  )

  return properties.find(
    (property) => property.name === (alias?.encoreName ?? statId)
  )
}

/**
 * Maps an Encore base stat to the values of the property level form.
 *
 * Encore names stats with abbreviations (`ATQ`, `PS`, ...) and scales
 * percentage stats by 100, so the id and the value are normalized before
 * filling the form. Unknown names are kept as-is.
 */
export function propertyLevelDraftFromEncore(
  property: EncoreProperty
): PropertyLevelDraft {
  const alias = RESONATOR_PROPERTY_ALIASES.find(
    (candidate) => candidate.encoreName === property.name
  )

  return {
    name: alias?.statId ?? property.name,
    baseValue: property.baseValue / (alias?.scale ?? 1),
    icon: property.icon,
  }
}

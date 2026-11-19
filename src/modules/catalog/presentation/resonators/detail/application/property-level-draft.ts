import type { EncoreProperty } from "@encore/domain/property"
import { RESONATOR_PROPERTY_ALIASES } from "@catalog/application/constants/resonator"
import { statLabel } from "@catalog/application/stats/stats"
import type { ResonatorPropertyLevelInput } from "@catalog/application/schemas"

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

/** One Encore base stat offered by the property multi-select. */
export type PropertyLevelOption = {
  label: string
  value: string
  draft: PropertyLevelDraft
}

/** Values handled by the property level form, including the Encore selection. */
export type PropertyLevelFormValues = ResonatorPropertyLevelInput & {
  /** Selected `PropertyLevelOption` values. */
  encoreProperties: string[]
}

/** Encore base stats the resonator does not have yet. */
export function propertyLevelOptions(
  encoreProperties: EncoreProperty[],
  savedNames: string[]
): PropertyLevelOption[] {
  return encoreProperties.flatMap((property, index) => {
    const draft = propertyLevelDraftFromEncore(property)

    if (savedNames.includes(draft.name)) {
      return []
    }

    return [
      {
        label: statLabel(draft.name),
        value: String(index),
        draft,
      },
    ]
  })
}

/**
 * Payloads for the selected Encore stats, or the manual entry.
 *
 * When the multi-select has values, they are expanded in Encore order and each
 * one gets the next `sortOrder`; otherwise the manual values are used.
 */
export function propertyLevelPayloads(
  values: PropertyLevelFormValues,
  options: PropertyLevelOption[]
): ResonatorPropertyLevelInput[] {
  if (values.encoreProperties.length === 0) {
    return [
      {
        resonatorId: values.resonatorId,
        sortOrder: values.sortOrder,
        name: values.name,
        baseValue: values.baseValue,
        icon: values.icon,
      },
    ]
  }

  return options
    .filter((option) => values.encoreProperties.includes(option.value))
    .map((option, index) => ({
      resonatorId: values.resonatorId,
      sortOrder: values.sortOrder + index,
      ...option.draft,
    }))
}

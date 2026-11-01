import type { ResonatorPropertyGrowthRow } from "@/db/schema"
import type { EncorePropertyGrowth } from "@/modules/encore/domain/property"

type GrowthValueColumns = {
  valueNumber: number | null
  valueText: string | null
}

/** Stored fields needed to format a growth value. */
type GrowthValue = Pick<ResonatorPropertyGrowthRow, "valueNumber" | "valueText">

export type GrowthMilestoneOption = {
  label: string
  value: string
  entry: EncorePropertyGrowth
}

/** Values handled by the growth form, including the Encore selection. */
export type PropertyGrowthFormValues = {
  propertyId: number
  sortOrder: number
  level: number
  value: string
  /** Selected `GrowthMilestoneOption` values. */
  encoreLevels: string[]
}

export type PropertyGrowthPayload = {
  propertyId: number
  sortOrder: number
  level: number
  value: string
}

/**
 * Whether a form value can be stored as a growth entry.
 *
 * Encore sends percentages as text (`5%`) and every other stat as a number, so
 * both shapes are accepted but the text must be a finite number.
 */
export function isGrowthValue(value: string): boolean {
  const trimmed = value.trim()

  if (trimmed.endsWith("%")) {
    const numeric = trimmed.slice(0, -1)

    return numeric.length > 0 && Number.isFinite(Number(numeric))
  }

  return trimmed.length > 0 && Number.isFinite(Number(trimmed))
}

/** Milestones offered by the Encore picker: 1 and every 10 levels up to 90. */
function isGrowthMilestone(level: number): boolean {
  return level >= 1 && level <= 90 && (level === 1 || level % 10 === 0)
}

/**
 * Milestone options from Encore that the property does not have yet.
 *
 * Encore repeats the ascension levels, so only the first entry of each level
 * is kept; levels with a saved growth entry are hidden.
 */
export function growthMilestoneOptions(
  encoreGrowth: EncorePropertyGrowth[],
  savedGrowth: Pick<ResonatorPropertyGrowthRow, "level">[]
): GrowthMilestoneOption[] {
  const seenLevels = new Set<number>()

  return encoreGrowth.flatMap((entry, index) => {
    if (!isGrowthMilestone(entry.level) || seenLevels.has(entry.level)) {
      return []
    }

    seenLevels.add(entry.level)

    if (savedGrowth.some((saved) => saved.level === entry.level)) {
      return []
    }

    return [
      {
        label: `Nivel ${entry.level}`,
        value: String(index),
        entry,
      },
    ]
  })
}

/**
 * Payloads for the selected Encore milestones, or the manual entry.
 *
 * When the multi-select has values, they are expanded in Encore order and each
 * one gets the next `sortOrder`; otherwise the manual level and value are used.
 */
export function propertyGrowthPayloads(
  values: PropertyGrowthFormValues,
  options: GrowthMilestoneOption[]
): PropertyGrowthPayload[] {
  if (values.encoreLevels.length === 0) {
    return [
      {
        propertyId: values.propertyId,
        sortOrder: values.sortOrder,
        level: values.level,
        value: values.value,
      },
    ]
  }

  return options
    .filter((option) => values.encoreLevels.includes(option.value))
    .map((option, index) => ({
      propertyId: values.propertyId,
      sortOrder: values.sortOrder + index,
      level: option.entry.level,
      value: String(option.entry.value),
    }))
}

/** Splits a form value into the number/text columns of the growth table. */
export function growthValueColumns(value: string): GrowthValueColumns {
  const trimmed = value.trim()

  if (trimmed.endsWith("%")) {
    return { valueNumber: null, valueText: trimmed }
  }

  return { valueNumber: Number(trimmed), valueText: null }
}

/** Value shown in the UI, preserving a stored zero. */
export function formatGrowthValue(entry: GrowthValue): string {
  return entry.valueText ?? entry.valueNumber?.toFixed(0)?.toString() ?? ""
}

import type { WeaponPropertyGrowthRow } from "@/db/schema"
import type { EncorePropertyGrowth } from "@/modules/encore/domain/property"

type GrowthValueColumns = {
  valueNumber: number | null
  valueText: string | null
}

/** Stored fields needed to format a growth value. */
type GrowthValue = Pick<WeaponPropertyGrowthRow, "valueNumber" | "valueText">

export type WeaponGrowthMilestoneOption = {
  label: string
  value: string
  entry: EncorePropertyGrowth
}

/** Values handled by the growth form, including the Encore selection. */
export type WeaponGrowthFormValues = {
  propertyId: number
  sortOrder: number
  level: number
  value: string
  /** Selected `WeaponGrowthMilestoneOption` values. */
  encoreLevels: string[]
}

export type WeaponGrowthPayload = {
  propertyId: number
  sortOrder: number
  level: number
  value: string
}

/**
 * Whether a form value can be stored as a growth entry.
 *
 * Weapon values arrive as decimal strings (`"412.50"`) and their percentage
 * substats as text (`"16.05%"`), so both shapes are accepted as long as the
 * text holds a finite number.
 */
export function isWeaponGrowthValue(value: string): boolean {
  const trimmed = value.trim()

  if (trimmed.endsWith("%")) {
    const numeric = trimmed.slice(0, -1)

    return numeric.length > 0 && Number.isFinite(Number(numeric))
  }

  return trimmed.length > 0 && Number.isFinite(Number(trimmed))
}

/** Milestones offered by the Encore picker: 1 and every 10 levels up to 90. */
function isWeaponGrowthMilestone(level: number): boolean {
  return level >= 1 && level <= 90 && (level === 1 || level % 10 === 0)
}

/**
 * Milestone options from Encore that the property does not have yet.
 *
 * Weapon growth also reports ascension levels such as `20.5`; they are not
 * milestones and are skipped. Levels with a saved growth entry are hidden.
 */
export function weaponGrowthMilestoneOptions(
  encoreGrowth: EncorePropertyGrowth[],
  savedGrowth: Pick<WeaponPropertyGrowthRow, "level">[]
): WeaponGrowthMilestoneOption[] {
  const seenLevels = new Set<number>()

  return encoreGrowth.flatMap((entry, index) => {
    if (!isWeaponGrowthMilestone(entry.level) || seenLevels.has(entry.level)) {
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
export function weaponGrowthPayloads(
  values: WeaponGrowthFormValues,
  options: WeaponGrowthMilestoneOption[]
): WeaponGrowthPayload[] {
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

/**
 * Stores the weapon growth value verbatim in `value_text`.
 *
 * Weapon values are decimals (`"412.50"`) even when they are not percentages,
 * so keeping the text avoids rounding them or losing their scale.
 */
export function weaponGrowthValueColumns(value: string): GrowthValueColumns {
  return { valueNumber: null, valueText: value.trim() }
}

/** Value shown in the UI, preserving decimals and percentages. */
export function formatWeaponGrowthValue(entry: GrowthValue): string {
  if (entry.valueText !== null) return entry.valueText
  return entry.valueNumber === null ? "" : String(entry.valueNumber)
}

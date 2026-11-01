import type { ResonatorPropertyGrowthRow } from "@/db/schema"

type GrowthValueColumns = {
  valueNumber: number | null
  valueText: string | null
}

/** Stored fields needed to format a growth value. */
type GrowthValue = Pick<ResonatorPropertyGrowthRow, "valueNumber" | "valueText">

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
  return entry.valueText ?? entry.valueNumber?.toString() ?? ""
}

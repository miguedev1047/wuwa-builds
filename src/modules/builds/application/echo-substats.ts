import { SELECT_SUBSTATS_OPTIONS } from "@builds/constants/substats"

export type EchoSubstatOption = (typeof SELECT_SUBSTATS_OPTIONS)[1][number]

const SUBSTATS_BY_COST: Record<number, EchoSubstatOption[]> = {
  1: SELECT_SUBSTATS_OPTIONS[1],
  3: SELECT_SUBSTATS_OPTIONS[3],
  4: SELECT_SUBSTATS_OPTIONS[4],
}

/** Substat options available for an echo cost. */
export function echoSubstatOptions(cost: number): EchoSubstatOption[] {
  return SUBSTATS_BY_COST[cost] ?? []
}

/** Possible roll values for one substat key. */
export function echoSubstatValues(cost: number, stat: string): number[] {
  return (
    echoSubstatOptions(cost).find((option) => option.stat === stat)?.values ??
    []
  )
}

/**
 * Options for one substat row.
 *
 * Hides stats already selected by the other rows while keeping the row's own
 * selection so its select still has a valid value.
 */
export function echoSubstatOptionsExcluding(
  options: EchoSubstatOption[],
  selectedStats: string[],
  currentStat: string
): EchoSubstatOption[] {
  return options.filter(
    (option) =>
      option.stat === currentStat || !selectedStats.includes(option.stat)
  )
}

/** Percentage substats whose label does not include a `%` sign. */
const PERCENT_SUBSTAT_LABELS = new Set([
  "Prob. Crít.",
  "Daño Crít.",
  "Regen. de Energía",
  "Bono Ataque Básico",
  "Bono Ataque Cargado",
  "Bono Habilidad",
  "Bono Liberación",
])

/** Display value of a substat roll: percentages get `%`, flat stats do not. */
export function formatEchoSubstatValue(label: string, value: number): string {
  const isPercent =
    label.includes("%") ||
    PERCENT_SUBSTAT_LABELS.has(label) ||
    !Number.isInteger(value)

  return isPercent ? `${value}%` : String(value)
}

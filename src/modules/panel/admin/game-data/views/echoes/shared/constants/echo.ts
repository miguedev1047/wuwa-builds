import { ECHO_COSTS } from "@game-data/application/schemas"

/** Build cost of an echo, in points. */
export const ECHO_COST_OPTIONS = ECHO_COSTS.map((cost) => ({
  label: `Coste ${cost}`,
  value: cost,
}))

/**
 * Echo classes, matching the Encore `Rarity` tier.
 *
 * `0` is a common 1-cost enemy, `1` an elite 3-cost one, `2` a 4-cost boss and
 * `3` a 4-cost calamity.
 */
export const ECHO_CLASS_OPTIONS = [
  { label: "Común", value: 0 },
  { label: "Élite", value: 1 },
  { label: "Jefe", value: 2 },
  { label: "Calamidad", value: 3 },
]

/** Display label of an echo class, e.g. `Élite`. */
export function echoClassLabel(value: number): string {
  return (
    ECHO_CLASS_OPTIONS.find((option) => option.value === value)?.label ??
    `Clase ${value}`
  )
}

/** Display label of an echo cost, e.g. `Coste 4`. */
export function echoCostLabel(value: number): string {
  return (
    ECHO_COST_OPTIONS.find((option) => option.value === value)?.label ??
    `Coste ${value}`
  )
}

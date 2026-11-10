import type { SelectOption } from "@game-data/application/options"

/** Conditions an echo skill bonus can depend on. */
export const ECHO_SKILL_CONDITION_IDS = [
  "none",
  "resonator",
  "element",
  "weaponType",
  "combat",
] as const

export type EchoSkillConditionId = (typeof ECHO_SKILL_CONDITION_IDS)[number]

/**
 * Options of the condition select.
 *
 * `combat` covers every trigger that only exists while fighting (on cast, on
 * hit, during seconds): the builder shows it but never adds the value.
 */
export const ECHO_SKILL_CONDITIONS: SelectOption<EchoSkillConditionId>[] = [
  { label: "Siempre", value: "none" },
  { label: "Resonador", value: "resonator" },
  { label: "Elemento", value: "element" },
  { label: "Tipo de arma", value: "weaponType" },
  { label: "En combate", value: "combat" },
]

/** Panel label of a condition, falling back to the raw value. */
export function echoSkillConditionLabel(condition: string): string {
  return (
    ECHO_SKILL_CONDITIONS.find((option) => option.value === condition)?.label ??
    condition
  )
}

/** Narrows a stored string to a known condition id. */
export function isEchoSkillCondition(
  value: string
): value is EchoSkillConditionId {
  return (ECHO_SKILL_CONDITION_IDS as readonly string[]).includes(value)
}

/** Conditions the builder can resolve, i.e. everything except `combat`. */
export function isComputedCondition(condition: EchoSkillConditionId): boolean {
  return condition !== "combat"
}

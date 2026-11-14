export type StatKind = "flat" | "percent"

/**
 * Canonical stat keys shared by the builder and the panel.
 *
 * `statId` is the only identifier these keys have: it is what the catalog
 * stores, what a select binds to and what `calculateCharacterStats` sums.
 * Labels live in `STAT_LABELS` and are presentation only, so a translation or
 * a typo in the copy can never break a calculation.
 */
export const STAT_KINDS = {
  hp: "flat",
  atk: "flat",
  def: "flat",
  hp_percent: "percent",
  atk_percent: "percent",
  def_percent: "percent",
  crit_rate: "percent",
  crit_dmg: "percent",
  energy_regen: "percent",
  healing_bonus: "percent",
  basic_atk_bonus: "percent",
  heavy_atk_bonus: "percent",
  skill_bonus: "percent",
  liberation_bonus: "percent",
  aero_dmg: "percent",
  glacio_dmg: "percent",
  electro_dmg: "percent",
  fusion_dmg: "percent",
  havoc_dmg: "percent",
  spectro_dmg: "percent",
  echo_skill_bonus: "percent",
  break_impulse: "flat",
} as const satisfies Record<string, StatKind>

export type BuildStatKey = keyof typeof STAT_KINDS

/** Panel copy of every stat, keyed by its canonical id. */
export const STAT_LABELS: Record<BuildStatKey, string> = {
  hp: "Vida",
  atk: "Ataque",
  def: "Defensa",
  hp_percent: "Vida %",
  atk_percent: "Ataque %",
  def_percent: "Defensa %",
  crit_rate: "Prob. Crit.",
  crit_dmg: "Daño Crit.",
  energy_regen: "Recarga de energía",
  healing_bonus: "Bono de curación",
  basic_atk_bonus: "Bono de Daño de Ataque básico",
  heavy_atk_bonus: "Bono de Daño de Ataque cargado",
  skill_bonus: "Bono de Daño de Habilidad",
  liberation_bonus: "Bono de Daño de Liberación",
  aero_dmg: "Bono de Daño Aero",
  glacio_dmg: "Bono de Daño Glacio",
  electro_dmg: "Bono de Daño Electro",
  fusion_dmg: "Bono de Daño Fusión",
  havoc_dmg: "Bono de Daño Destrucción",
  spectro_dmg: "Bono de Daño Espectro",
  echo_skill_bonus: "Bono de Eco",
  break_impulse: "Impulso de Ruptura de Tonalidad",
}

/** Every stat id, in the order the panel lists them. */
export const STAT_KEYS = Object.keys(STAT_KINDS) as BuildStatKey[]

/** Element id to its canonical damage-bonus stat key. */
export const ELEMENT_STAT_KEYS = {
  aero: "aero_dmg",
  glacio: "glacio_dmg",
  electro: "electro_dmg",
  fusion: "fusion_dmg",
  havoc: "havoc_dmg",
  spectro: "spectro_dmg",
} as const satisfies Record<string, BuildStatKey>

export type ElementStatKey =
  (typeof ELEMENT_STAT_KEYS)[keyof typeof ELEMENT_STAT_KEYS]

/** Canonical damage-bonus key of an element id, or `null` if unknown. */
export function elementStatKey(
  element: string | null | undefined
): ElementStatKey | null {
  if (!element) return null
  return ELEMENT_STAT_KEYS[element as keyof typeof ELEMENT_STAT_KEYS] ?? null
}

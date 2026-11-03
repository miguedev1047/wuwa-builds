/**
 * Canonical builder stat keys.
 *
 * Every catalog that grants a percentage bonus (weapon refinements, sonata
 * effects) stores this `statId`, never the label, so the builder can sum them
 * without matching localized text. `label` is the panel copy and may differ
 * from the Encore wording, which lives in the sync aliases.
 */
export const STATS = [
  { label: "Ataque", statId: "atk" },
  { label: "Ataque %", statId: "atk_percent" },
  { label: "Vida", statId: "hp" },
  { label: "Vida %", statId: "hp_percent" },
  { label: "Defensa", statId: "def" },
  { label: "Defensa %", statId: "def_percent" },
  { label: "Prob. Crit.", statId: "crit_rate" },
  { label: "Daño Crit.", statId: "crit_dmg" },
  { label: "Recarga de energía", statId: "energy_regen" },
  { label: "Bono de curación", statId: "healing_bonus" },
  { label: "Bono de Daño de Ataque básico", statId: "basic_atk_bonus" },
  { label: "Bono de Daño de Ataque cargado", statId: "heavy_atk_bonus" },
  { label: "Bono de Daño de Habilidad", statId: "skill_bonus" },
  { label: "Bono de Daño de Liberación", statId: "liberation_bonus" },
  { label: "Bono de Daño Aero", statId: "aero_dmg" },
  { label: "Bono de Daño Glacio", statId: "glacio_dmg" },
  { label: "Bono de Daño Electro", statId: "electro_dmg" },
  { label: "Bono de Daño Fusión", statId: "fusion_dmg" },
  { label: "Bono de Daño Destrucción", statId: "havoc_dmg" },
  { label: "Bono de Daño Espectro", statId: "spectro_dmg" },
  { label: "Bono de Eco", statId: "echo_skill_bonus" },
] as const

export type StatId = (typeof STATS)[number]["statId"]

/** Non-empty tuple for `z.enum` and other APIs that need at least one key. */
export const STAT_IDS = STATS.map((stat) => stat.statId) as [
  StatId,
  ...StatId[],
]

/** Options of every stat select. */
export const STAT_OPTIONS = STATS.map(({ label, statId }) => ({
  label,
  value: statId,
}))

/** Panel label of a stat, falling back to the raw id. */
export function statLabel(statId: string): string {
  return STATS.find((stat) => stat.statId === statId)?.label ?? statId
}

/** Narrows a stored `stat_id` to the canonical union. */
export function isStatId(value: string | null): value is StatId {
  return value !== null && STATS.some((stat) => stat.statId === value)
}

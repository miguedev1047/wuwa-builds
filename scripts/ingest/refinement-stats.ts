import type { StatId } from "@catalog/application/stats/stats"

/**
 * Static stat extraction from Encore refinement prose (Spanish).
 *
 * A weapon passive mixes calculable clauses ("El ATQ aumenta un 12%") with
 * combat triggers ("Durante 15 s tras lanzar..."). Only the first clause of
 * each sentence is a stat the builder can add; the rest stays as prose in
 * `weapon_refinements.effect`.
 */

/** Encore Spanish stat labels mapped to canonical stat ids. */
export const REFINEMENT_STAT_ALIASES: Record<string, StatId> = {
  atq: "atk_percent",
  "el atq": "atk_percent",
  ps: "hp_percent",
  "los ps": "hp_percent",
  "los ps máximos": "hp_percent",
  defensa: "def_percent",
  "la defensa": "def_percent",
  def: "def_percent",
  "la def": "def_percent",
  "prob. crit": "crit_rate",
  "prob. crít": "crit_rate",
  "prob crit": "crit_rate",
  "daño crit": "crit_dmg",
  "daño crit.": "crit_dmg",
  "regen. de energía": "energy_regen",
  "regen. de energia": "energy_regen",
  "regen. energía": "energy_regen",
  "recarga de energía": "energy_regen",
  "bonif. de curación": "healing_bonus",
  "bonif. de curación.": "healing_bonus",
  "bono de curación": "healing_bonus",
  "bonif. de daño de ataque básico": "basic_atk_bonus",
  "bonif. de daño de ataque básico.": "basic_atk_bonus",
  "bonif. de daño de ataque cargado": "heavy_atk_bonus",
  "bonif. de daño de ataque cargado.": "heavy_atk_bonus",
  "bonif. de ataque básico": "basic_atk_bonus",
  "bonif. de ataque básico.": "basic_atk_bonus",
  "bonif. de ataque cargado": "heavy_atk_bonus",
  "bonif. de daño de habilidad": "skill_bonus",
  "bonif. de daño de habilidad de resonancia": "skill_bonus",
  "bonif. de daño de habilidad de resonancia.": "skill_bonus",
  "bonif. de habilidad de resonancia": "skill_bonus",
  "bonif. de daño de liberación": "liberation_bonus",
  "bonif. de daño de liberación de resonancia": "liberation_bonus",
  "bonif. de daño de liberación de resonancia.": "liberation_bonus",
  "bonif. de liberación de resonancia": "liberation_bonus",
  "bonif. de daño aero": "aero_dmg",
  "bonif. de daño glacio": "glacio_dmg",
  "bonif. de daño gelio": "glacio_dmg",
  "bonif. de daño electro": "electro_dmg",
  "bonif. de daño fusión": "fusion_dmg",
  "bonif. de daño fusion": "fusion_dmg",
  "bonif. de daño destrucción": "havoc_dmg",
  "bonif. de daño destruccion": "havoc_dmg",
  "bonif. de daño espectro": "spectro_dmg",
  "bonif. de daño de habilidad de eco": "echo_skill_bonus",
  "bonif. de habilidad de eco": "echo_skill_bonus",
  "daño de la habilidad de resonancia": "skill_bonus",
  "daño de la liberación de resonancia": "liberation_bonus",
  "daño de ataque básico": "basic_atk_bonus",
  "daño de ataque cargado": "heavy_atk_bonus",
  "daño aero": "aero_dmg",
  "daño glacio": "glacio_dmg",
  "daño gelio": "glacio_dmg",
  "daño electro": "electro_dmg",
  "daño fusión": "fusion_dmg",
  "daño destrucción": "havoc_dmg",
  "daño espectro": "spectro_dmg",
}

/** Parsed static stat of one refinement rank. */
export interface RefinementStat {
  statId: StatId
  value: number
}

/** Removes the colored `<span>` markup Encore embeds in effect text. */
export function stripEffectHtml(effect: string): string {
  return effect.replace(/<[^>]+>/g, "")
}

const STAT_CLAUSE =
  /(?:el |la |los |las |su )?(.+?)(?:\s+m[áa]ximos|\s+m[áa]ximas)?\s+(?:aumenta(?:n)?|se\s+aumenta(?:n)?)\s+(?:en\s+)?(?:un\s+|una\s+)?([\d.]+)\s*%/i

/**
 * Verb-first clause: "Aumenta la Regen. de energía en un 12.8%." / "Incrementa
 * la X un Y%." Encore starts some passives with the verb instead of the stat.
 */
const VERB_FIRST_CLAUSE = new RegExp(
  `(?:aumenta|incrementa)\\s+(?:el |la |los |las |su )?(.+?)(?:\\s+m[áa]ximos|\\s+m[áa]ximas)?\\s+(?:en\\s+)?(?:un\\s+|una\\s+)?([\\d.]+)\\s*%`,
  "i"
)

/**
 * Reads the first stat clause of a refinement effect, or `null`.
 *
 * Only one stat per rank is extracted: weapons with a static passive have it
 * in the first sentence, and the rest is combat conditions.
 */
/**
 * Combat triggers that make a stat conditional.
 *
 * A clause opened by one of these markers ("Cuando los PS están por encima de
 * 80%, aumenta el ATQ...") only applies while fighting, so the value must not
 * become a static row even when the grammar parses.
 */
const TRIGGER_MARKERS = [
  "cuando",
  "al lanzar",
  "al infligir",
  "al golpear",
  "al provocar",
  "al aplicar",
  "al atacar",
  "al cambiar",
  "al activar",
  "al transformar",
  "al consumir",
  "al obtener",
  "al recibir",
  "al salir",
  "al entrar",
  "dentro de",
  "durante ",
  "tras ",
  "después de",
  "despues de",
  "mientras",
  "cada ",
  "acumul",
  "por encima",
  "por debajo",
  "no recibe",
  "se libera",
  "se lanza",
  "sale del campo",
  "está en el campo",
]

/** Whether the clause leading to `index` carries a combat trigger. */
function hasTriggerBefore(text: string, index: number): boolean {
  const boundary = Math.max(text.lastIndexOf(".", index), 0)
  const prefix = text.slice(boundary, index).toLowerCase()

  return TRIGGER_MARKERS.some((marker) => prefix.includes(marker))
}

/** Whether the rest of the clause after the value carries a trigger. */
function hasTriggerAfter(text: string, end: number): boolean {
  const nextPeriod = text.indexOf(".", end)
  const suffix = text
    .slice(end, nextPeriod === -1 ? text.length : nextPeriod)
    .toLowerCase()

  return TRIGGER_MARKERS.some((marker) => suffix.includes(marker))
}

export function parseRefinementStat(effect: string): RefinementStat | null {
  const text = stripEffectHtml(effect).trim()
  const match = STAT_CLAUSE.exec(text) ?? VERB_FIRST_CLAUSE.exec(text)

  if (!match) return null
  if (match.index > 0 && hasTriggerBefore(text, match.index)) return null
  if (hasTriggerAfter(text, match.index + match[0].length)) return null

  const key = match[1].trim().toLowerCase().replace(/\s+/g, " ")
  const statId = REFINEMENT_STAT_ALIASES[key]

  if (!statId) return null

  const value = Number(match[2])

  return Number.isFinite(value) ? { statId, value } : null
}

/**
 * Parses every rank of one weapon and reports whether the values escalate.
 *
 * Encore publishes the same passive with rank-substituted values, so a clean
 * parse escalates monotonically. When it does not, the caller curates by hand.
 */
export function parseRefinementStats(effectsByRank: Map<number, string>): {
  stats: Map<number, RefinementStat>
  escalates: boolean
} {
  const stats = new Map<number, RefinementStat>()
  const values: number[] = []

  for (const [rank, effect] of [...effectsByRank.entries()].sort(
    ([left], [right]) => left - right
  )) {
    const parsed = parseRefinementStat(effect)

    if (!parsed) continue

    stats.set(rank, parsed)
    values.push(parsed.value)
  }

  if (stats.size === 0 || stats.size !== effectsByRank.size) {
    return { stats, escalates: false }
  }

  const escalates = values.every(
    (value, index) => index === 0 || value >= values[index - 1]
  )

  return { stats, escalates }
}

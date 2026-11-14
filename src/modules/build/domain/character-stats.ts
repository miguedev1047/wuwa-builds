import {
  STAT_KINDS,
  type BuildStatKey,
  type StatKind,
} from "@build/domain/stats"

/**
 * Final stat sheet of a build, keyed by the canonical stat ids.
 *
 * These keys match the stat icon asset names in `src/assets/icons/stats`, so a
 * stat has one spelling in the catalog, the calculator, the icons and the UI.
 *
 * Only the stats the calculator outputs are listed. Input-only stats
 * (`hp_percent`, `echo_skill_bonus`, ...) stay in `STAT_KINDS` and in the
 * contribution trace, but are not part of the final sheet.
 */
export const CHARACTER_STAT_KEYS = [
  "hp",
  "atk",
  "def",
  "crit_rate",
  "crit_dmg",
  "energy_regen",
  "healing_bonus",
  "basic_atk_bonus",
  "heavy_atk_bonus",
  "skill_bonus",
  "liberation_bonus",
  "aero_dmg",
  "glacio_dmg",
  "electro_dmg",
  "fusion_dmg",
  "havoc_dmg",
  "spectro_dmg",
] as const satisfies readonly BuildStatKey[]

export type CharacterStatKey = (typeof CHARACTER_STAT_KEYS)[number]

export type CharacterStats = Record<CharacterStatKey, number>

export type CharacterBaseStats = Pick<
  CharacterStats,
  "hp" | "atk" | "def" | "crit_rate" | "crit_dmg" | "energy_regen"
>

export interface CharacterStatBonus {
  statId: string
  value: number
  source?: string
}

export interface CharacterConditionalEffect {
  source: string
  description: string
}

export interface CharacterCalculationInput {
  base: CharacterBaseStats
  weaponBaseAtk: number
  bonuses: CharacterStatBonus[]
  diagnostics?: string[]
  conditionalEffects?: CharacterConditionalEffect[]
}

export interface CharacterCalculationTrace {
  base: CharacterBaseStats
  effectiveBase: CharacterBaseStats
  weaponBaseAtk: number
  effectiveWeaponBaseAtk: number
  contributions: CharacterStatContribution[]
  totalsByStat: Record<string, number>
  totals: CharacterStats
}

export interface CharacterStatContribution {
  statId: string
  value: number
  kind: StatKind | null
  source: string
  applied: boolean
}

export interface CharacterCalculationResult {
  stats: CharacterStats
  diagnostics: string[]
  unmappedBonuses: CharacterStatBonus[]
  conditionalEffects: CharacterConditionalEffect[]
  trace: CharacterCalculationTrace
}

const CHARACTER_STAT_KEY_SET = new Set<string>(CHARACTER_STAT_KEYS)

function isCharacterStatKey(value: string): value is CharacterStatKey {
  return CHARACTER_STAT_KEY_SET.has(value)
}

function unique(values: string[]): string[] {
  return [...new Set(values)]
}

/**
 * Pure build-stat calculator.
 *
 * HP/ATK/DEF follow the game's integer rule: the resonator base and the weapon
 * base ATK are floored, and each percentage contribution is floored before it
 * is summed. Percentage stats (CRIT, energy, healing, damage and element
 * bonuses) keep their decimal points.
 *
 * It receives already-resolved base stats and normalized bonuses. It never
 * performs I/O, hooks or catalog lookups. Percentages are display points:
 * `22.4` means `22.4%`.
 */
export function calculateCharacterStats(
  input: CharacterCalculationInput
): CharacterCalculationResult {
  const diagnostics = [...(input.diagnostics ?? [])]
  const unmappedBonuses: CharacterStatBonus[] = []
  const contributions: CharacterStatContribution[] = []

  const effectiveBase: CharacterBaseStats = {
    hp: Math.floor(input.base.hp),
    atk: Math.floor(input.base.atk),
    def: Math.floor(input.base.def),
    crit_rate: input.base.crit_rate,
    crit_dmg: input.base.crit_dmg,
    energy_regen: input.base.energy_regen,
  }
  const effectiveWeaponBaseAtk = Math.floor(input.weaponBaseAtk)
  const baseAtk = effectiveBase.atk + effectiveWeaponBaseAtk

  const stats: CharacterStats = {
    hp: effectiveBase.hp,
    atk: baseAtk,
    def: effectiveBase.def,
    crit_rate: effectiveBase.crit_rate,
    crit_dmg: effectiveBase.crit_dmg,
    energy_regen: effectiveBase.energy_regen,
    healing_bonus: 0,
    basic_atk_bonus: 0,
    heavy_atk_bonus: 0,
    skill_bonus: 0,
    liberation_bonus: 0,
    aero_dmg: 0,
    glacio_dmg: 0,
    electro_dmg: 0,
    fusion_dmg: 0,
    havoc_dmg: 0,
    spectro_dmg: 0,
  }

  for (const bonus of input.bonuses) {
    const kind = STAT_KINDS[bonus.statId as BuildStatKey]
    const contribution: CharacterStatContribution = {
      statId: bonus.statId,
      value: bonus.value,
      kind: kind ?? null,
      source: bonus.source ?? "unknown",
      applied: false,
    }

    contributions.push(contribution)

    if (!kind) {
      diagnostics.push(`Unknown stat: ${bonus.statId}`)
      unmappedBonuses.push(bonus)
      continue
    }

    if (bonus.statId === "hp_percent") {
      stats.hp += Math.floor((effectiveBase.hp * bonus.value) / 100)
      contribution.applied = true
      continue
    }

    if (bonus.statId === "atk_percent") {
      stats.atk += Math.floor((baseAtk * bonus.value) / 100)
      contribution.applied = true
      continue
    }

    if (bonus.statId === "def_percent") {
      stats.def += Math.floor((effectiveBase.def * bonus.value) / 100)
      contribution.applied = true
      continue
    }

    if (
      bonus.statId === "hp" ||
      bonus.statId === "atk" ||
      bonus.statId === "def" ||
      isCharacterStatKey(bonus.statId)
    ) {
      stats[bonus.statId] += bonus.value
      contribution.applied = true
      continue
    }

    diagnostics.push(`${bonus.statId} is not part of CharacterStats`)
    unmappedBonuses.push(bonus)
  }

  const totalsByStat: Record<string, number> = {}

  for (const contribution of contributions) {
    if (!contribution.applied) continue

    totalsByStat[contribution.statId] =
      (totalsByStat[contribution.statId] ?? 0) + contribution.value
  }

  return {
    stats,
    diagnostics: unique(diagnostics),
    unmappedBonuses,
    conditionalEffects: input.conditionalEffects ?? [],
    trace: {
      base: input.base,
      effectiveBase,
      weaponBaseAtk: input.weaponBaseAtk,
      effectiveWeaponBaseAtk,
      contributions,
      totalsByStat,
      totals: stats,
    },
  }
}

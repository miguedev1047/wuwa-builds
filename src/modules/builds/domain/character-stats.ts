import { STAT_KINDS, type BuildStatKey, type StatKind } from "./stats"

export interface ElementDmgBonus {
  glacio: number
  fusion: number
  electro: number
  aero: number
  spectro: number
  havoc: number
}

export interface CharacterStats {
  hp: number
  atk: number
  def: number
  energyRegen: number
  critRate: number
  critDmg: number
  skillDmg: number
  basicDmg: number
  heavyDmg: number
  liberationDmg: number
  healingBonus: number
  elementDmgBonus: ElementDmgBonus
}

export interface CharacterStatBonus {
  statId: string
  value: number
  source?: string
}

export interface CharacterConditionalEffect {
  source: string
  description: string
}

export interface CharacterBaseStats {
  hp: number
  atk: number
  def: number
  critRate: number
  critDmg: number
  energyRegen: number
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

const DIRECT_STATS: Record<
  string,
  "critRate" | "critDmg" | "energyRegen" | "healingBonus"
> = {
  crit_rate: "critRate",
  crit_dmg: "critDmg",
  energy_regen: "energyRegen",
  healing_bonus: "healingBonus",
}

const DAMAGE_STATS: Record<
  string,
  "basicDmg" | "heavyDmg" | "skillDmg" | "liberationDmg"
> = {
  basic_atk_bonus: "basicDmg",
  heavy_atk_bonus: "heavyDmg",
  skill_bonus: "skillDmg",
  liberation_bonus: "liberationDmg",
}

const ELEMENT_STATS: Record<string, keyof ElementDmgBonus> = {
  aero_dmg: "aero",
  glacio_dmg: "glacio",
  electro_dmg: "electro",
  fusion_dmg: "fusion",
  spectro_dmg: "spectro",
  havoc_dmg: "havoc",
}

const PERCENT_BASE_STATS = new Set(["hp_percent", "atk_percent", "def_percent"])

const FLAT_BASE_STATS = new Set(["hp", "atk", "def"])

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
  const flat: Record<string, number> = {}
  const direct = {
    critRate: 0,
    critDmg: 0,
    energyRegen: 0,
    healingBonus: 0,
  }
  const damage = {
    basicDmg: 0,
    heavyDmg: 0,
    skillDmg: 0,
    liberationDmg: 0,
  }
  const element: ElementDmgBonus = {
    glacio: 0,
    fusion: 0,
    electro: 0,
    aero: 0,
    spectro: 0,
    havoc: 0,
  }

  const diagnostics = [...(input.diagnostics ?? [])]
  const unmappedBonuses: CharacterStatBonus[] = []
  const contributions: CharacterStatContribution[] = []

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

    const directKey = DIRECT_STATS[bonus.statId]

    if (directKey) {
      direct[directKey] += bonus.value
      contribution.applied = true
      continue
    }

    const damageKey = DAMAGE_STATS[bonus.statId]

    if (damageKey) {
      damage[damageKey] += bonus.value
      contribution.applied = true
      continue
    }

    const elementKey = ELEMENT_STATS[bonus.statId]

    if (elementKey) {
      element[elementKey] += bonus.value
      contribution.applied = true
      continue
    }

    if (FLAT_BASE_STATS.has(bonus.statId)) {
      flat[bonus.statId] = (flat[bonus.statId] ?? 0) + bonus.value
      contribution.applied = true
      continue
    }

    if (PERCENT_BASE_STATS.has(bonus.statId)) {
      contribution.applied = true
      continue
    }

    diagnostics.push(`${bonus.statId} is not part of CharacterStats`)
    unmappedBonuses.push(bonus)
  }

  const effectiveBase: CharacterBaseStats = {
    hp: Math.floor(input.base.hp),
    atk: Math.floor(input.base.atk),
    def: Math.floor(input.base.def),
    critRate: input.base.critRate,
    critDmg: input.base.critDmg,
    energyRegen: input.base.energyRegen,
  }
  const effectiveWeaponBaseAtk = Math.floor(input.weaponBaseAtk)
  const baseAtk = effectiveBase.atk + effectiveWeaponBaseAtk

  let hpFromPercent = 0
  let atkFromPercent = 0
  let defFromPercent = 0

  for (const contribution of contributions) {
    if (!contribution.applied) continue

    if (contribution.statId === "hp_percent") {
      hpFromPercent += Math.floor((effectiveBase.hp * contribution.value) / 100)
    } else if (contribution.statId === "atk_percent") {
      atkFromPercent += Math.floor((baseAtk * contribution.value) / 100)
    } else if (contribution.statId === "def_percent") {
      defFromPercent += Math.floor(
        (effectiveBase.def * contribution.value) / 100
      )
    }
  }

  const hp = effectiveBase.hp + hpFromPercent + (flat.hp ?? 0)
  const atk = baseAtk + atkFromPercent + (flat.atk ?? 0)
  const def = effectiveBase.def + defFromPercent + (flat.def ?? 0)

  const totalsByStat: Record<string, number> = {}

  for (const contribution of contributions) {
    if (!contribution.applied) continue

    totalsByStat[contribution.statId] =
      (totalsByStat[contribution.statId] ?? 0) + contribution.value
  }

  const stats: CharacterStats = {
    hp,
    atk,
    def,
    energyRegen: effectiveBase.energyRegen + direct.energyRegen,
    critRate: effectiveBase.critRate + direct.critRate,
    critDmg: effectiveBase.critDmg + direct.critDmg,
    skillDmg: damage.skillDmg,
    basicDmg: damage.basicDmg,
    heavyDmg: damage.heavyDmg,
    liberationDmg: damage.liberationDmg,
    healingBonus: direct.healingBonus,
    elementDmgBonus: element,
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

import type { BuildPayload } from "./build"

export type StatKind = "flat" | "percent"

/**
 * Application-owned canonical stat keys. Values are display units:
 * percentage points for percent stats, flat values otherwise.
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
} as const satisfies Record<string, StatKind>

export type BuildStatKey = keyof typeof STAT_KINDS

export interface ResolvedStatBonus {
  statId: string
  value: number
}

export interface BuildReferenceData {
  /** Character base stats already resolved for the selected level. */
  character: {
    baseHp: number
    baseAtk: number
    baseDef: number
    critRate: number
    critDmg: number
    energyRegen: number
  }
  /** Weapon base ATK and secondary stat already resolved for its level. */
  weapon: {
    baseAtk: number
    secondary?: ResolvedStatBonus | null
  } | null
  /** Main-stat value per equipped slot, aligned with payload.echoLoadout. */
  echoMainStats?: Array<ResolvedStatBonus | null>
  /** Set bonuses or other computed bonuses, already normalized. */
  extraBonuses?: ResolvedStatBonus[]
}

export interface CalculatedStats {
  hp: number
  atk: number
  def: number
  critRate: number
  critDmg: number
  energyRegen: number
  healingBonus: number
  elementBonus: Record<string, number>
  damageBonus: Record<string, number>
  unknownStats: string[]
}

const ELEMENT_KEYS = new Set([
  "aero_dmg",
  "glacio_dmg",
  "electro_dmg",
  "fusion_dmg",
  "havoc_dmg",
  "spectro_dmg",
])

const DAMAGE_KEYS = new Set([
  "basic_atk_bonus",
  "heavy_atk_bonus",
  "skill_bonus",
  "liberation_bonus",
])

/**
 * Pure stat calculator. It receives the build payload plus already-resolved
 * character/weapon values and never performs I/O, hooks, or catalog lookups.
 */
export function calculateBuildStats(
  payload: BuildPayload,
  reference: BuildReferenceData
): CalculatedStats {
  const flat: Record<string, number> = {}
  const percent: Record<string, number> = {}
  const unknownStats = new Set<string>()

  const add = (bonus: ResolvedStatBonus) => {
    const kind = STAT_KINDS[bonus.statId as BuildStatKey]
    if (!kind) {
      unknownStats.add(bonus.statId)
      return
    }

    if (kind === "flat") {
      flat[bonus.statId] = (flat[bonus.statId] ?? 0) + bonus.value
    } else {
      percent[bonus.statId] = (percent[bonus.statId] ?? 0) + bonus.value
    }
  }

  payload.echoLoadout.forEach((slot, index) => {
    const mainStat = reference.echoMainStats?.[index]
    if (mainStat) add(mainStat)
    for (const substat of slot.substats) add(substat)
  })

  if (reference.weapon?.secondary) add(reference.weapon.secondary)
  for (const bonus of reference.extraBonuses ?? []) add(bonus)

  const baseAtk = reference.character.baseAtk + (reference.weapon?.baseAtk ?? 0)
  const baseHp = reference.character.baseHp
  const baseDef = reference.character.baseDef

  const atkPercent = (percent.atk_percent ?? 0) / 100
  const hpPercent = (percent.hp_percent ?? 0) / 100
  const defPercent = (percent.def_percent ?? 0) / 100

  const elementBonus: Record<string, number> = {}
  const damageBonus: Record<string, number> = {}

  for (const [key, value] of Object.entries(percent)) {
    if (ELEMENT_KEYS.has(key)) elementBonus[key] = value
    else if (DAMAGE_KEYS.has(key)) damageBonus[key] = value
  }

  return {
    hp: baseHp * (1 + hpPercent) + (flat.hp ?? 0),
    atk: baseAtk * (1 + atkPercent) + (flat.atk ?? 0),
    def: baseDef * (1 + defPercent) + (flat.def ?? 0),
    critRate: reference.character.critRate + (percent.crit_rate ?? 0),
    critDmg: reference.character.critDmg + (percent.crit_dmg ?? 0),
    energyRegen: reference.character.energyRegen + (percent.energy_regen ?? 0),
    healingBonus: percent.healing_bonus ?? 0,
    elementBonus,
    damageBonus,
    unknownStats: [...unknownStats],
  }
}

import type { CharacterStats } from "@/modules/builds/domain/character-stats"

export interface CharacterStatsDisplay {
  hp: string
  atk: string
  def: string
  energyRegen: string
  critRate: string
  critDmg: string
  skillDmg: string
  basicDmg: string
  heavyDmg: string
  liberationDmg: string
  healingBonus: string
  elementDmgBonus: Record<string, string>
}

/** Display value of a flat stat: rounded once, at the UI boundary. */
export function formatFlatStat(value: number): string {
  return String(Math.round(value))
}

/** Display value of a percentage stat with one decimal and no trailing `.0`. */
export function formatPercentStat(value: number): string {
  return `${Number(value.toFixed(1))}%`
}

/** Formats a raw stats object without touching the calculation values. */
export function formatCharacterStats(
  stats: CharacterStats
): CharacterStatsDisplay {
  return {
    hp: formatFlatStat(stats.hp),
    atk: formatFlatStat(stats.atk),
    def: formatFlatStat(stats.def),
    energyRegen: formatPercentStat(stats.energyRegen),
    critRate: formatPercentStat(stats.critRate),
    critDmg: formatPercentStat(stats.critDmg),
    skillDmg: formatPercentStat(stats.skillDmg),
    basicDmg: formatPercentStat(stats.basicDmg),
    heavyDmg: formatPercentStat(stats.heavyDmg),
    liberationDmg: formatPercentStat(stats.liberationDmg),
    healingBonus: formatPercentStat(stats.healingBonus),
    elementDmgBonus: Object.fromEntries(
      Object.entries(stats.elementDmgBonus).map(([element, value]) => [
        element,
        formatPercentStat(value),
      ])
    ),
  }
}

import {
  CHARACTER_STAT_KEYS,
  type CharacterStatKey,
  type CharacterStats,
} from "@builds/domain/character-stats"
import { STAT_KINDS } from "@builds/domain/stats"

export type CharacterStatsDisplay = Record<CharacterStatKey, string>

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
  return Object.fromEntries(
    CHARACTER_STAT_KEYS.map((key) => [
      key,
      STAT_KINDS[key] === "percent"
        ? formatPercentStat(stats[key])
        : formatFlatStat(stats[key]),
    ])
  ) as CharacterStatsDisplay
}

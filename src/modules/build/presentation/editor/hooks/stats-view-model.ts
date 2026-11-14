import type {
  CharacterStatKey,
  CharacterStats,
} from "@build/domain/character-stats"
import { normalizeElementId } from "@build/application/calculation/normalize"
import { elementStatKey, STAT_KINDS } from "@build/domain/stats"
import { RESONATOR_ELEMENTS } from "@catalog/application/constants/resonator"
import { isStatId } from "@catalog/application/stats/stats"

export interface StatsRow {
  key: CharacterStatKey
  label: string
  value: number
  percent: boolean
}

/** Display value of a flat stat, rounded only at the UI boundary. */
export function formatFlatStat(value: number): string {
  return String(Math.round(value))
}

/** Display value of a percentage stat with one decimal and no trailing `.0`. */
export function formatPercentStat(value: number): string {
  return `${Number(value.toFixed(1))}%`
}

/** Formats one row without changing the calculation value. */
export function formatStatValue(row: StatsRow): string {
  return row.percent ? formatPercentStat(row.value) : formatFlatStat(row.value)
}

/** Ordered rows of the build stats card. */
export function statsRows(
  stats: CharacterStats,
  element: string | null
): StatsRow[] {
  const elementId = normalizeElementId(element)
  const elementLabel =
    RESONATOR_ELEMENTS.find((option) => option.value === elementId)?.label ??
    elementId
  const elementStat = elementStatKey(elementId)

  return [
    { key: "hp", label: "Vida", value: stats.hp, percent: false },
    { key: "atk", label: "Ataque", value: stats.atk, percent: false },
    { key: "def", label: "Defensa", value: stats.def, percent: false },
    {
      key: "energy_regen",
      label: "Regen. energía",
      value: stats.energy_regen,
      percent: true,
    },
    {
      key: "crit_rate",
      label: "Prob. Crit.",
      value: stats.crit_rate,
      percent: true,
    },
    {
      key: "crit_dmg",
      label: "Daño Crit.",
      value: stats.crit_dmg,
      percent: true,
    },
    {
      key: "skill_bonus",
      label: "Daño Habilidad",
      value: stats.skill_bonus,
      percent: true,
    },
    {
      key: "basic_atk_bonus",
      label: "Daño Ataque Básico",
      value: stats.basic_atk_bonus,
      percent: true,
    },
    {
      key: "heavy_atk_bonus",
      label: "Daño Ataque Cargado",
      value: stats.heavy_atk_bonus,
      percent: true,
    },
    {
      key: "liberation_bonus",
      label: "Daño Liberación",
      value: stats.liberation_bonus,
      percent: true,
    },
    ...(elementLabel && elementStat
      ? [
          {
            key: elementStat,
            label: `Bono ${elementLabel}`,
            value: stats[elementStat],
            percent: true,
          },
        ]
      : []),
    {
      key: "healing_bonus",
      label: "Bono Curación",
      value: stats.healing_bonus,
      percent: true,
    },
  ]
}

export function formatEchoStat(stat: string, value: number): string {
  return isStatId(stat) && STAT_KINDS[stat] === "flat"
    ? formatFlatStat(value)
    : formatPercentStat(value)
}

export function statIconName(stat: string) {
  return isStatId(stat) ? stat : null
}

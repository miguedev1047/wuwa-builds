import type {
  CharacterStats,
  ElementDmgBonus,
} from "@/modules/builds/domain/character-stats"
import { normalizeElementId } from "@/modules/builds/application/calculation/normalize"
import { RESONATOR_ELEMENTS } from "@/modules/game-data/application/constants/resonator"

export interface StatsRow {
  key: string
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
  const elementBonus =
    elementId && elementId in stats.elementDmgBonus
      ? stats.elementDmgBonus[elementId as keyof ElementDmgBonus]
      : null

  return [
    { key: "hp", label: "Vida", value: stats.hp, percent: false },
    { key: "atk", label: "Ataque", value: stats.atk, percent: false },
    { key: "def", label: "Defensa", value: stats.def, percent: false },
    {
      key: "energy_regen",
      label: "Regen. energía",
      value: stats.energyRegen,
      percent: true,
    },
    {
      key: "crit_rate",
      label: "Prob. Crit.",
      value: stats.critRate,
      percent: true,
    },
    {
      key: "crit_dmg",
      label: "Daño Crit.",
      value: stats.critDmg,
      percent: true,
    },
    {
      key: "skill_dmg",
      label: "Daño Habilidad",
      value: stats.skillDmg,
      percent: true,
    },
    {
      key: "basic_dmg",
      label: "Daño Ataque Básico",
      value: stats.basicDmg,
      percent: true,
    },
    {
      key: "heavy_dmg",
      label: "Daño Ataque Cargado",
      value: stats.heavyDmg,
      percent: true,
    },
    {
      key: "liberation_dmg",
      label: "Daño Liberación",
      value: stats.liberationDmg,
      percent: true,
    },
    ...(elementLabel && elementBonus !== null
      ? [
          {
            key: `element_${elementId}`,
            label: `Bono ${elementLabel}`,
            value: elementBonus,
            percent: true,
          },
        ]
      : []),
    {
      key: "healing_bonus",
      label: "Bono Curación",
      value: stats.healingBonus,
      percent: true,
    },
  ]
}

import type {
  CharacterStatKey,
  CharacterStats,
} from "@/modules/builds/domain/character-stats"
import { elementStatKey } from "@/modules/builds/domain/stats"

export interface BuildStatRow {
  key: CharacterStatKey
  label: string
  value: number
  percent: boolean
}

/** Ordered rows shown by the build stats sheet. */
export function buildStatRows({
  stats,
  elementId,
  elementLabel,
}: {
  stats: CharacterStats
  elementId: string | null
  elementLabel: string | null
}): BuildStatRow[] {
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

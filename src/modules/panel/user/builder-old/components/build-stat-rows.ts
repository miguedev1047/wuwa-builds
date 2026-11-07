import type {
  CharacterStats,
  ElementDmgBonus,
} from "@/modules/builds/domain/character-stats"

export interface BuildStatRow {
  key: string
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

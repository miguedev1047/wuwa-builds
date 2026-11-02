/**
 * Stats a weapon refinement can grant, as the panel and the builder see them.
 *
 * `statId` is the canonical builder key; the catalog stores the label in
 * `weapon_refinement_stats.stat_name`. `Bono de Eco` has no builder key yet.
 */
export const WEAPON_REFINEMENT_STATS = [
  { label: "Ataque", value: "Ataque", statId: "atk" },
  { label: "Ataque %", value: "Ataque %", statId: "atk_percent" },
  { label: "Vida", value: "Vida", statId: "hp" },
  { label: "Vida %", value: "Vida %", statId: "hp_percent" },
  { label: "Defensa", value: "Defensa", statId: "def" },
  { label: "Defensa %", value: "Defensa %", statId: "def_percent" },
  { label: "Prob. Crit.", value: "Prob. Crit.", statId: "crit_rate" },
  { label: "Daño Crit.", value: "Daño Crit.", statId: "crit_dmg" },
  {
    label: "Recarga de energía",
    value: "Recarga de energía",
    statId: "energy_regen",
  },
  {
    label: "Bono de curación",
    value: "Bono de curación",
    statId: "healing_bonus",
  },
  {
    label: "Bono de Daño de Ataque básico",
    value: "Bono de Daño de Ataque básico",
    statId: "basic_atk_bonus",
  },
  {
    label: "Bono de Daño de Ataque cargado",
    value: "Bono de Daño de Ataque cargado",
    statId: "heavy_atk_bonus",
  },
  {
    label: "Bono de Daño de Habilidad",
    value: "Bono de Daño de Habilidad",
    statId: "skill_bonus",
  },
  {
    label: "Bono de Daño de Liberación",
    value: "Bono de Daño de Liberación",
    statId: "liberation_bonus",
  },
  {
    label: "Bono de Daño Aero",
    value: "Bono de Daño Aero",
    statId: "aero_dmg",
  },
  {
    label: "Bono de Daño Glacio",
    value: "Bono de Daño Glacio",
    statId: "glacio_dmg",
  },
  {
    label: "Bono de Daño Electro",
    value: "Bono de Daño Electro",
    statId: "electro_dmg",
  },
  {
    label: "Bono de Daño Fusión",
    value: "Bono de Daño Fusión",
    statId: "fusion_dmg",
  },
  {
    label: "Bono de Daño Destrucción",
    value: "Bono de Daño Destrucción",
    statId: "havoc_dmg",
  },
  {
    label: "Bono de Daño Espectro",
    value: "Bono de Daño Espectro",
    statId: "spectro_dmg",
  },
  { label: "Bono de Eco", value: "Bono de Eco" },
] as const

/** Options of the stat select in the refinement dialogs. */
export const WEAPON_REFINEMENT_STAT_OPTIONS = WEAPON_REFINEMENT_STATS.map(
  ({ label, value }) => ({ label, value })
)

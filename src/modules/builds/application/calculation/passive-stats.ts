/**
 * Explicit mapping from Encore passive titles to canonical stat ids.
 *
 * Encore stores the stat passives as a localized title plus a prose
 * description, so the title is the only stable signal the builder has until
 * the catalog stores a `statId`. Only percentage passives are listed here;
 * named passives and prose-only effects stay as conditional effects.
 */
const PASSIVE_STAT_IDS: Record<string, string> = {
  "PS+": "hp_percent",
  "ATQ+": "atk_percent",
  "DEF+": "def_percent",
  "Prob. CRIT+": "crit_rate",
  "Daño CRIT+": "crit_dmg",
  "Regen. de energía+": "energy_regen",
  "Regen. energía+": "energy_regen",
  "Recarga de energía+": "energy_regen",
  "Bono de curación+": "healing_bonus",
  "Daño Aero+": "aero_dmg",
  "Daño Electro+": "electro_dmg",
  "Daño Fusión+": "fusion_dmg",
  "Daño Gelio+": "glacio_dmg",
  "Daño Destrucción+": "havoc_dmg",
  "Daño Espectro+": "spectro_dmg",
  "Bono de Daño de Ataque básico+": "basic_atk_bonus",
  "Bono de Daño de Ataque cargado+": "heavy_atk_bonus",
  "Bono de Daño de Habilidad+": "skill_bonus",
  "Bono de Daño de Liberación+": "liberation_bonus",
  "Bono Ataque Básico+": "basic_atk_bonus",
  "Bono Ataque Cargado+": "heavy_atk_bonus",
  "Bono Habilidad+": "skill_bonus",
  "Bono Liberación+": "liberation_bonus",
}

/** Canonical stat id of a passive title, or null when it is not a stat. */
export function passiveStatId(title: string): string | null {
  return PASSIVE_STAT_IDS[title.trim().replace(/\s+/g, " ")] ?? null
}

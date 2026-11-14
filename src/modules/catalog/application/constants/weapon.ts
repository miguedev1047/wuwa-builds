import type { SelectOption } from "@catalog/application/options"
import { statOptions, type StatId } from "@catalog/application/stats/stats"
import { WEAPON_TYPES } from "@catalog/application/weapons/types"

export const WEAPON_RARITY: SelectOption<number>[] = [
  { label: "5 Estrellas", value: 5 },
  { label: "4 Estrellas", value: 4 },
  { label: "3 Estrellas", value: 3 },
  { label: "2 Estrellas", value: 2 },
  { label: "1 Estrella", value: 1 },
]

/** Weapon type options shared by the form fields and future detail screens. */
export const WEAPON_TYPE_OPTIONS = WEAPON_TYPES

/** Refinement ranks of a weapon, 1 to 5. */
export const WEAPON_REFINEMENT_RANKS: SelectOption<number>[] = [
  { label: "Refinamiento 1", value: 1 },
  { label: "Refinamiento 2", value: 2 },
  { label: "Refinamiento 3", value: 3 },
  { label: "Refinamiento 4", value: 4 },
  { label: "Refinamiento 5", value: 5 },
]

/** Display label of a weapon rarity, e.g. `5 Estrellas`. */
export function weaponRarityLabel(rarity: number): string {
  return (
    WEAPON_RARITY.find((option) => option.value === rarity)?.label ??
    `${rarity} Estrellas`
  )
}

/** `GroupIndex` of the ten Weapon Level nodes. */
export const WEAPON_LEVELS: SelectOption<number>[] = [
  { label: "Nivel 1", value: 1 },
  { label: "Nivel 10", value: 10 },
  { label: "Nivel 20", value: 20 },
  { label: "Nivel 30", value: 30 },
  { label: "Nivel 40", value: 40 },
  { label: "Nivel 50", value: 50 },
  { label: "Nivel 60", value: 60 },
  { label: "Nivel 70", value: 70 },
  { label: "Nivel 80", value: 80 },
  { label: "Nivel 90", value: 90 },
]

/** Stats a weapon can store in `weapon_properties` (base + secondary). */
export const WEAPON_PROPERTY_STATS = [
  "atk",
  "atk_percent",
  "hp_percent",
  "def_percent",
  "crit_rate",
  "crit_dmg",
  "energy_regen",
] as const satisfies readonly StatId[]

/** Options of the weapon property form. */
export const WEAPON_PROPERTY_OPTIONS = statOptions(WEAPON_PROPERTY_STATS)

/** Secondary stats a weapon property can resolve to (no flat attack). */
export const WEAPON_SECONDARY_STAT_OPTIONS = statOptions(
  WEAPON_PROPERTY_STATS.filter((statId) => statId !== "atk")
)

/**
 * Encore aliases of the weapon stats.
 *
 * Encore reuses `ATQ` for the flat base attack and for the attack percentage
 * substat, so `percent` disambiguates both entries. This is import metadata:
 * it never reaches a select.
 */
export const WEAPON_PROPERTY_ALIASES: {
  encoreName: string
  percent: boolean
  statId: StatId
}[] = [
  { encoreName: "ATQ", percent: false, statId: "atk" },
  { encoreName: "ATQ", percent: true, statId: "atk_percent" },
  { encoreName: "PS", percent: true, statId: "hp_percent" },
  { encoreName: "DEF", percent: true, statId: "def_percent" },
  { encoreName: "Prob. CRIT", percent: true, statId: "crit_rate" },
  { encoreName: "Daño CRIT", percent: true, statId: "crit_dmg" },
  { encoreName: "Regen. de energía", percent: true, statId: "energy_regen" },
]

/** Canonical stat id of an Encore weapon stat, or `null` when unknown. */
export function weaponPropertyStatId(
  encoreName: string,
  percent: boolean
): StatId | null {
  return (
    WEAPON_PROPERTY_ALIASES.find(
      (alias) => alias.encoreName === encoreName && alias.percent === percent
    )?.statId ?? null
  )
}

/** Narrows a stored string to a weapon property stat id. */
export function isWeaponPropertyStatId(value: string): value is StatId {
  return (WEAPON_PROPERTY_STATS as readonly string[]).includes(value)
}

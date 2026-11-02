import { WEAPON_TYPES } from "@/modules/panel/admin/game-data/application/weapons/types"

export const WEAPON_RARITY = [
  {
    label: "5 Estrellas",
    value: 5,
  },
  {
    label: "4 Estrellas",
    value: 4,
  },
  {
    label: "3 Estrellas",
    value: 3,
  },
  {
    label: "2 Estrellas",
    value: 2,
  },
  {
    label: "1 Estrella",
    value: 1,
  },
]

/** Weapon type options shared by the form fields and future detail screens. */
export const WEAPON_TYPE_OPTIONS = WEAPON_TYPES

/** Refinement ranks of a weapon, 1 to 5. */
export const WEAPON_REFINEMENT_RANKS = [
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

/**
 * Weapon stats the panel can store in `weapon_properties`.
 *
 * Encore reuses `ATQ` for the flat base attack and for the percentage attack
 * substat, so `encorePercent` disambiguates both entries. Every other stat is
 * always a percentage on a weapon.
 */
export const WEAPON_PROPERTY_NAMES = [
  {
    label: "Ataque",
    value: "Ataque",
    encoreName: "ATQ",
    encorePercent: false,
  },
  {
    label: "Ataque %",
    value: "Ataque %",
    encoreName: "ATQ",
    encorePercent: true,
  },
  {
    label: "Vida %",
    value: "Vida %",
    encoreName: "PS",
    encorePercent: true,
  },
  {
    label: "Defensa %",
    value: "Defensa %",
    encoreName: "DEF",
    encorePercent: true,
  },
  {
    label: "Prob. Crit.",
    value: "Prob. Crit.",
    encoreName: "Prob. CRIT",
    encorePercent: true,
  },
  {
    label: "Daño Crit.",
    value: "Daño Crit.",
    encoreName: "Daño CRIT",
    encorePercent: true,
  },
  {
    label: "Recarga de energía",
    value: "Recarga de energía",
    encoreName: "Regen. de energía",
    encorePercent: true,
  },
] as const

export const WEAPON_STATS_NAMES = [
  {
    label: "Ataque %",
    value: "Ataque %",
    encoreName: "ATQ",
    encorePercent: true,
  },
  {
    label: "Vida %",
    value: "Vida %",
    encoreName: "PS",
    encorePercent: true,
  },
  {
    label: "Defensa %",
    value: "Defensa %",
    encoreName: "DEF",
    encorePercent: true,
  },
  {
    label: "Prob. Crit.",
    value: "Prob. Crit.",
    encoreName: "Prob. CRIT",
    encorePercent: true,
  },
  {
    label: "Daño Crit.",
    value: "Daño Crit.",
    encoreName: "Daño CRIT",
    encorePercent: true,
  },
  {
    label: "Recarga de energía",
    value: "Recarga de energía",
    encoreName: "Regen. de energía",
    encorePercent: true,
  },
] as const

import type { SelectOption } from "@game-data/application/options"
import { statOptions, type StatId } from "@game-data/application/stats/stats"

export const RESONATOR_RARITY: SelectOption<number>[] = [
  { label: "5 Estrellas", value: 5 },
  { label: "4 Estrellas", value: 4 },
  { label: "3 Estrellas", value: 3 },
  { label: "2 Estrellas", value: 2 },
  { label: "1 Estrella", value: 1 },
]

/** Canonical element keys. */
export const ELEMENT_IDS = [
  "aero",
  "havoc",
  "electro",
  "spectro",
  "fusion",
  "glacio",
] as const

export type ElementId = (typeof ELEMENT_IDS)[number]

/** Element options. `value` is the id stored in `resonators.element`. */
export const RESONATOR_ELEMENTS: SelectOption<ElementId>[] = [
  { label: "Aero", value: "aero" },
  { label: "Destrucción", value: "havoc" },
  { label: "Electro", value: "electro" },
  { label: "Espectro", value: "spectro" },
  { label: "Fusión", value: "fusion" },
  { label: "Gelio", value: "glacio" },
]

/** Encore element name to canonical id. */
export const ELEMENT_BY_ENCORE: Record<string, ElementId> = {
  Aero: "aero",
  Destrucción: "havoc",
  Electro: "electro",
  Espectro: "spectro",
  Fusión: "fusion",
  Gelio: "glacio",
}

/** Narrows a stored string to a known element id. */
export function isElementId(value: string): value is ElementId {
  return (ELEMENT_IDS as readonly string[]).includes(value)
}

/** Canonical resonator weapon type keys. */
export const WEAPON_TYPE_IDS = [
  "broadblade",
  "sword",
  "pistols",
  "gauntlets",
  "rectifier",
] as const

export type WeaponTypeId = (typeof WEAPON_TYPE_IDS)[number]

/** Weapon type options. `value` is the id stored in `resonators.weapon_type`. */
export const RESONATOR_WEAPON_TYPES: SelectOption<WeaponTypeId>[] = [
  { label: "Mandoble", value: "broadblade" },
  { label: "Espada", value: "sword" },
  { label: "Pistolas", value: "pistols" },
  { label: "Brazales", value: "gauntlets" },
  { label: "Rectificador", value: "rectifier" },
]

/** Encore weapon type name to canonical id. */
export const WEAPON_TYPE_BY_ENCORE: Record<string, WeaponTypeId> = {
  Mandoble: "broadblade",
  Espada: "sword",
  Pistolas: "pistols",
  Brazales: "gauntlets",
  Rectificador: "rectifier",
}

/** Narrows a stored string to a known weapon type id. */
export function isWeaponTypeId(value: string): value is WeaponTypeId {
  return (WEAPON_TYPE_IDS as readonly string[]).includes(value)
}

/** Canonical resonator image keys, in display order. */
export const RESONATOR_MEDIA_KINDS = [
  "card",
  "icon",
  "iconLarge",
  "circle",
  "portrait",
] as const

export type ResonatorMediaKind = (typeof RESONATOR_MEDIA_KINDS)[number]

/** Panel label of each resonator image. */
export const RESONATOR_MEDIA_LABELS: Record<ResonatorMediaKind, string> = {
  card: "Card",
  icon: "Icono",
  iconLarge: "Icono grande",
  circle: "Círculo",
  portrait: "Retrato",
}

/** Narrows a stored string to a known resonator image key. */
export function isResonatorMediaKind(
  value: string
): value is ResonatorMediaKind {
  return (RESONATOR_MEDIA_KINDS as readonly string[]).includes(value)
}

/** Panel label of a resonator image, falling back to the raw key. */
export function resonatorMediaLabel(kind: string): string {
  return isResonatorMediaKind(kind) ? RESONATOR_MEDIA_LABELS[kind] : kind
}

/** Base stats a resonator can have in `resonator_property_levels`. */
export const RESONATOR_PROPERTY_STATS = [
  "atk",
  "hp",
  "def",
  "crit_rate",
  "crit_dmg",
  "break_impulse",
] as const satisfies readonly StatId[]

/** Options of the resonator property form. */
export const RESONATOR_PROPERTY_OPTIONS = statOptions(RESONATOR_PROPERTY_STATS)

/** Narrows a stored string to a resonator property stat id. */
export function isResonatorPropertyStatId(value: string): value is StatId {
  return (RESONATOR_PROPERTY_STATS as readonly string[]).includes(value)
}

/**
 * Encore aliases of the resonator base stats.
 *
 * `scale` is the factor between the API value and the stored one: percentage
 * stats come multiplied by 100 (`500` and `15000` for a base of `5` and `150`).
 * Import metadata only; it never reaches a select.
 */
export const RESONATOR_PROPERTY_ALIASES: {
  encoreName: string
  statId: StatId
  scale: number
}[] = [
  { encoreName: "ATQ", statId: "atk", scale: 1 },
  { encoreName: "PS", statId: "hp", scale: 1 },
  { encoreName: "DEF", statId: "def", scale: 1 },
  { encoreName: "Prob. CRIT", statId: "crit_rate", scale: 100 },
  { encoreName: "Daño CRIT", statId: "crit_dmg", scale: 100 },
  {
    encoreName: "Impulso de Ruptura de Tonalidad",
    statId: "break_impulse",
    scale: 1,
  },
]

/** `GroupIndex` of the six Resonant Chain nodes. */
export const RESONATOR_SEQUENCE: SelectOption<number>[] = [
  { label: "Sin secuencia activa", value: 0 },
  { label: "Secuencia 1", value: 1 },
  { label: "Secuencia 2", value: 2 },
  { label: "Secuencia 3", value: 3 },
  { label: "Secuencia 4", value: 4 },
  { label: "Secuencia 5", value: 5 },
  { label: "Secuencia 6", value: 6 },
]

/** `GroupIndex` of the ten Resonant Level nodes. */
export const RESONATOR_LEVELS: SelectOption<number>[] = [
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

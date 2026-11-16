import type { SelectOption } from "@catalog/application/options"
import { statOptions, type StatId } from "@catalog/application/stats/stats"

export const RESONATOR_RARITY_MAX_RANGE = 2

export {
  RARITY_OPTIONS as RESONATOR_RARITY,
  ELEMENT_IDS,
  WEAPON_TYPE_IDS,
  ELEMENT_OPTIONS as RESONATOR_ELEMENTS,
  WEAPON_TYPE_OPTIONS as RESONATOR_WEAPON_TYPES,
  isElementId,
  isWeaponTypeId,
  type ElementId,
  type WeaponTypeId,
} from "@/modules/game-data/domain/categories"

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

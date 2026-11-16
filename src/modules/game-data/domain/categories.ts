import { z } from "zod"

/** Stable category ids and Spanish display labels, shared by every consumer. */
export const ELEMENTS = [
  { value: "aero", label: "Aero" },
  { value: "havoc", label: "Destrucción" },
  { value: "electro", label: "Electro" },
  { value: "spectro", label: "Espectro" },
  { value: "fusion", label: "Fusión" },
  { value: "glacio", label: "Gelio" },
] as const

/** Encore codes are explicit metadata; display ordering never changes their meaning. */
export const WEAPON_TYPES = [
  { value: "broadblade", label: "Mandoble", encoreCode: 1 },
  { value: "sword", label: "Espada", encoreCode: 2 },
  { value: "pistols", label: "Pistolas", encoreCode: 3 },
  { value: "gauntlets", label: "Brazales", encoreCode: 4 },
  { value: "rectifier", label: "Rectificador", encoreCode: 5 },
] as const

/** Echo tier metadata preserves the distinction between bosses and calamities. */
export const ECHO_CLASSES = [
  { value: "common", label: "Común", encoreCode: 0, cost: 1 },
  { value: "elite", label: "Élite", encoreCode: 1, cost: 3 },
  { value: "boss", label: "Jefe", encoreCode: 2, cost: 4 },
  { value: "calamity", label: "Calamidad", encoreCode: 3, cost: 4 },
] as const

export const RARITIES = [5, 4, 3, 2, 1] as const
export const ECHO_COSTS = [1, 3, 4] as const
export const ELEMENT_IDS = ids(ELEMENTS)
export const WEAPON_TYPE_IDS = ids(WEAPON_TYPES)
export const ECHO_CLASS_IDS = ids(ECHO_CLASSES)
export const elementSchema = z.enum(ELEMENT_IDS)
export const weaponTypeSchema = z.enum(WEAPON_TYPE_IDS)
export const echoClassSchema = z.enum(ECHO_CLASS_IDS)
export const raritySchema = z.union(RARITIES.map((value) => z.literal(value)))
export const echoCostSchema = z.union(
  ECHO_COSTS.map((value) => z.literal(value)),
  { error: "El coste debe ser 1, 3 o 4" }
)
export type ElementId = z.infer<typeof elementSchema>
export type WeaponTypeId = z.infer<typeof weaponTypeSchema>
export type EchoClassId = z.infer<typeof echoClassSchema>
export type Rarity = z.infer<typeof raritySchema>
export type EchoCost = z.infer<typeof echoCostSchema>

/** UI options are derived copies so form libraries cannot mutate the registry. */
export const ELEMENT_OPTIONS = ELEMENTS.map((item) => ({
  value: item.value,
  label: item.label,
}))
export const WEAPON_TYPE_OPTIONS = WEAPON_TYPES.map((item) => ({
  value: item.value,
  label: item.label,
}))
export const ECHO_CLASS_OPTIONS = ECHO_CLASSES.map((item) => ({
  value: item.value,
  label: item.label,
}))
export const RARITY_OPTIONS = RARITIES.map((value) => ({
  label: `${value} ${value === 1 ? "Estrella" : "Estrellas"}`,
  value,
}))
export const ECHO_COST_OPTIONS = ECHO_COSTS.map((value) => ({
  label: `Coste ${value}`,
  value,
}))

/** Narrows an external string to a canonical category id. */
export function isElementId(value: string): value is ElementId {
  return elementSchema.safeParse(value).success
}

/** Narrows an external string to a canonical weapon type. */
export function isWeaponTypeId(value: string): value is WeaponTypeId {
  return weaponTypeSchema.safeParse(value).success
}

/** Resolves a label from its canonical category registry. */
export function categoryLabel<T extends string | number>(
  options: readonly { value: T; label: string }[],
  value: T
): string {
  return options.find((item) => item.value === value)?.label ?? String(value)
}

/** Maps a nonempty registry while preserving its nonempty tuple type. */
function ids<T extends string>(
  items: readonly [{ value: T }, ...{ value: T }[]]
): [T, ...T[]] {
  return [items[0].value, ...items.slice(1).map((item) => item.value)]
}

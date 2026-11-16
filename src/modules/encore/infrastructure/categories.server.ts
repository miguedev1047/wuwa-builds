import { z } from "zod"
import {
  ELEMENTS,
  WEAPON_TYPES,
  ECHO_CLASSES,
  elementSchema,
  weaponTypeSchema,
  type WeaponTypeId,
} from "@/modules/game-data/domain/categories"

/** Localized names are an Encore wire format, never an internal input format. */
const elementNames: Record<string, string> = {
  Aero: "aero",
  Havoc: "havoc",
  Electro: "electro",
  Spectro: "spectro",
  Fusion: "fusion",
  Glacio: "glacio",
  ...Object.fromEntries(ELEMENTS.map((item) => [item.label, item.value])),
}
const weaponNames: Record<string, string> = {
  Broadblade: "broadblade",
  Sword: "sword",
  Pistols: "pistols",
  Gauntlets: "gauntlets",
  Rectifier: "rectifier",
  ...Object.fromEntries(WEAPON_TYPES.map((item) => [item.label, item.value])),
}
const encoreCodeSchema = z.number().int()

/** Converts the localized element name returned by Encore. */
export function encoreElementId(value: unknown) {
  const name = z.string().parse(value)
  return elementSchema.parse(
    Object.hasOwn(elementNames, name) ? elementNames[name] : undefined
  )
}

/** Converts a localized weapon name from an Encore character response. */
export function encoreWeaponTypeIdFromName(value: unknown) {
  const name = z.string().parse(value)
  return weaponTypeSchema.parse(
    Object.hasOwn(weaponNames, name) ? weaponNames[name] : undefined
  )
}

/** Converts the numeric weapon code from an Encore weapon response. */
export function encoreWeaponTypeId(value: unknown): WeaponTypeId {
  const code = encoreCodeSchema.parse(value)
  const weapon = WEAPON_TYPES.find((item) => item.encoreCode === code)
  if (!weapon) throw new Error(`Unknown Encore weapon type: ${code}`)
  return weapon.value
}

/** Converts the numeric echo tier returned by Encore to its category and cost. */
export function encoreEchoTier(value: unknown) {
  const code = encoreCodeSchema.parse(value)
  const tier = ECHO_CLASSES.find((item) => item.encoreCode === code)
  if (!tier) throw new Error(`Unknown Encore echo tier: ${code}`)
  return { class: tier.value, cost: tier.cost }
}

import type { EncoreProperty } from "./property"

export interface EncoreWeaponSummary {
  id: number
  name: string
  rarity: number
  type: number
  typeName: string
  icon: string
}

export interface EncoreWeaponBreach {
  id: number
  level: number
  levelLimit: number
  items: unknown[]
}

export interface EncoreWeaponDetail extends EncoreWeaponSummary {
  description: string
  effect: string
  properties: EncoreProperty[]
  breaches: EncoreWeaponBreach[]
}

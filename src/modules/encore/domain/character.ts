import type { EncoreProperty } from "./property"

export type { EncoreProperty, EncorePropertyGrowth } from "./property"

/** Localized text as returned by the Encore API. */
export interface EncoreText {
  Title?: string
  Content?: string
}

export interface EncoreCharacterSummary {
  id: number
  name: string
  rarity: number
  element: string
  weaponType: string
  icon: string
}

export interface EncoreSkillAttribute {
  id: number
  name: string
  values: string[]
  description?: string
}

export interface EncoreSkill {
  id: number
  type: string
  name: string
  description: string
  icon: string
  media: string
  attributes: EncoreSkillAttribute[]
  consumes: unknown[]
  damage: unknown[]
}

export interface EncoreSequence {
  id: number
  index: number
  name: string
  description: string
}

export interface EncoreCostItem {
  key: number
  value: number
  icon: string
  quality: number
}

export interface EncorePassive {
  id: number
  title: string
  description: string
  icon: string
  consume: EncoreCostItem[]
}

export interface EncoreBreach {
  id: number
  level: number
  maxLevel: number
  items: unknown[]
}

export interface EncoreTag {
  name: string
  description: string
  color: string
  icon: string
}

export interface EncoreCharacterImages {
  card: string
  icon: string
  iconLarge: string
  circle: string
  portrait: string
}

/** Lean character payload: lore-only fields are intentionally not stored. */
export interface EncoreCharacterDetail extends EncoreCharacterSummary {
  nickname: string
  introduction: string
  images: EncoreCharacterImages
  tags: EncoreTag[]
  properties: EncoreProperty[]
  skills: EncoreSkill[]
  sequences: EncoreSequence[]
  passives: EncorePassive[]
  breaches: EncoreBreach[]
}

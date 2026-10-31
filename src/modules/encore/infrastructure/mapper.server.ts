import type {
  EncoreBreach,
  EncoreCharacterDetail,
  EncoreCharacterSummary,
  EncoreCostItem,
  EncorePassive,
  EncoreSequence,
  EncoreSkill,
  EncoreTag,
} from "../domain/character"
import type {
  EncoreEchoDetail,
  EncoreEchoSet,
  EncoreEchoSummary,
} from "../domain/echo"
import { encoreAssetUrl } from "../domain/asset"
import type { EncoreProperty } from "../domain/property"
import type {
  EncoreWeaponBreach,
  EncoreWeaponDetail,
  EncoreWeaponSummary,
} from "../domain/weapon"

interface RawText {
  Title?: string
  Content?: string
}

interface RawRoleSummary {
  Id: number
  Name: string
  QualityId: number
  Element?: { Name?: string }
  WeaponType?: { Name?: string }
  RoleHeadIcon?: string
}

export interface RawCharacterList {
  roleList?: RawRoleSummary[]
}

interface RawGrowth {
  /** Present on character properties, unused by the mapper. */
  growthId?: number
  level?: number
  Level?: number
  value?: number | string
  Value?: number | string
}

interface RawProperty {
  Name?: string
  Icon?: string
  BaseValue?: number
  GrowthValues?: RawGrowth[]
}

interface RawSkillAttribute {
  attributeId: number
  attributeName: string
  values?: string[]
  Description?: string
}

interface RawSkill {
  SkillId: number
  SkillType?: string
  SkillName?: string
  SkillDescribe?: string
  Icon?: string
  SkillMedia?: string
  SkillAttributes?: RawSkillAttribute[]
  Consumes?: unknown[]
  DamageList?: unknown[]
}

interface RawSequence {
  Id: number
  GroupIndex?: number
  NodeName?: string
  AttributesDescription?: string
}

interface RawCostItem {
  Key: number
  Value: number
  Icon?: string
  QualityId?: number
}

interface RawPassive {
  Id: number
  PropertyNodeTitle?: string
  PropertyNodeDescribe?: string
  PropertyNodeIcon?: string
  Consume?: RawCostItem[]
}

interface RawBreach {
  Id: number
  BreachLevel?: number
  MaxLevel?: number
  Items?: unknown[]
}

interface RawTag {
  TagName?: string
  TagDesc?: string
  TagNameColor?: string
  TagIcon?: string
}

export interface RawCharacterDetail {
  Id: number
  Name?: RawText
  NickName?: RawText
  Introduction?: RawText
  QualityId?: number
  ElementName?: string
  WeaponTypeName?: string
  Card?: string
  RoleHeadIcon?: string
  RoleHeadIconLarge?: string
  RoleHeadIconCircle?: string
  RolePortrait?: string
  Tags?: RawTag[]
  Properties?: RawProperty[]
  Skills?: RawSkill[]
  ResonantChain?: RawSequence[]
  SkillTree?: RawPassive[]
  Breaches?: RawBreach[]
}

const text = (value?: RawText) => value?.Content || value?.Title || ""

export function toCharacterSummary(
  raw: RawRoleSummary
): EncoreCharacterSummary {
  return {
    id: raw.Id,
    name: raw.Name,
    rarity: raw.QualityId,
    element: raw.Element?.Name ?? "",
    weaponType: raw.WeaponType?.Name ?? "",
    icon: encoreAssetUrl(raw.RoleHeadIcon),
  }
}

function toProperty(raw: RawProperty): EncoreProperty {
  return {
    name: raw.Name ?? "",
    icon: encoreAssetUrl(raw.Icon),
    baseValue: raw.BaseValue ?? 0,
    growth: (raw.GrowthValues ?? []).map((growth) => ({
      level: growth.level ?? growth.Level ?? 0,
      value: growth.value ?? growth.Value ?? 0,
    })),
  }
}

function toSkill(raw: RawSkill): EncoreSkill {
  return {
    id: raw.SkillId,
    type: raw.SkillType ?? "",
    name: raw.SkillName ?? "",
    description: raw.SkillDescribe ?? "",
    icon: encoreAssetUrl(raw.Icon),
    media: raw.SkillMedia ?? "",
    attributes: (raw.SkillAttributes ?? []).map((attribute) => ({
      id: attribute.attributeId,
      name: attribute.attributeName,
      values: attribute.values ?? [],
      description: attribute.Description || undefined,
    })),
    consumes: raw.Consumes ?? [],
    damage: raw.DamageList ?? [],
  }
}

function toSequence(raw: RawSequence): EncoreSequence {
  return {
    id: raw.Id,
    index: raw.GroupIndex ?? 0,
    name: raw.NodeName ?? "",
    description: raw.AttributesDescription ?? "",
  }
}

function toCostItem(raw: RawCostItem): EncoreCostItem {
  return {
    key: raw.Key,
    value: raw.Value,
    icon: encoreAssetUrl(raw.Icon),
    quality: raw.QualityId ?? 0,
  }
}

function toPassive(raw: RawPassive): EncorePassive {
  return {
    id: raw.Id,
    title: raw.PropertyNodeTitle ?? "",
    description: raw.PropertyNodeDescribe ?? "",
    icon: encoreAssetUrl(raw.PropertyNodeIcon),
    consume: (raw.Consume ?? []).map(toCostItem),
  }
}

function toBreach(raw: RawBreach): EncoreBreach {
  return {
    id: raw.Id,
    level: raw.BreachLevel ?? 0,
    maxLevel: raw.MaxLevel ?? 0,
    items: raw.Items ?? [],
  }
}

function toTag(raw: RawTag): EncoreTag {
  return {
    name: raw.TagName ?? "",
    description: raw.TagDesc ?? "",
    color: raw.TagNameColor ?? "",
    icon: encoreAssetUrl(raw.TagIcon),
  }
}

export function toCharacterDetail(
  raw: RawCharacterDetail
): EncoreCharacterDetail {
  return {
    id: raw.Id,
    name: text(raw.Name),
    nickname: text(raw.NickName),
    introduction: text(raw.Introduction),
    rarity: raw.QualityId ?? 0,
    element: raw.ElementName ?? "",
    weaponType: raw.WeaponTypeName ?? "",
    icon: encoreAssetUrl(raw.RoleHeadIcon),
    images: {
      card: encoreAssetUrl(raw.Card),
      icon: encoreAssetUrl(raw.RoleHeadIcon),
      iconLarge: encoreAssetUrl(raw.RoleHeadIconLarge),
      circle: encoreAssetUrl(raw.RoleHeadIconCircle),
      portrait: encoreAssetUrl(raw.RolePortrait),
    },
    tags: (raw.Tags ?? []).map(toTag),
    properties: (raw.Properties ?? []).map(toProperty),
    skills: (raw.Skills ?? []).map(toSkill),
    sequences: (raw.ResonantChain ?? []).map(toSequence),
    passives: (raw.SkillTree ?? []).map(toPassive),
    breaches: (raw.Breaches ?? []).map(toBreach),
  }
}

interface RawWeaponSummary {
  Id: number
  Name: string
  Icon?: string
  Type?: number
  QualityId?: number
  TypeName?: string
}

export interface RawWeaponList {
  weapons?: RawWeaponSummary[]
}

interface RawWeaponBreach {
  Id: number
  Level?: number
  LevelLimit?: number
  Items?: unknown[]
}

export interface RawWeaponDetail {
  ItemId: number
  WeaponName?: string
  QualityId?: number
  WeaponType?: number
  WeaponTypeName?: string
  Icon?: string
  Desc?: string
  AttributesDescription?: string
  BgDescription?: string
  Properties?: RawProperty[]
  Breaches?: RawWeaponBreach[]
}

interface RawEchoFetter {
  Key: number
  EffectDescription?: string
}

interface RawEchoGroup {
  Id: number
  Name?: string
  Icon?: string
  Fetters?: RawEchoFetter[]
}

interface RawEchoSummary {
  Id: number
  Name: string
  Rarity?: number
  Icon?: string
  Element?: { Name?: string }
  Type?: string
  Attributes?: string
  FetterGroups?: RawEchoGroup[]
}

export interface RawEchoList {
  Echo?: RawEchoSummary[]
}

interface RawEchoSkill {
  DescriptionEx?: string
  SimplyDescription?: string
  SkillCD?: number
  DamageList?: unknown[]
}

interface RawEchoGroupDetail {
  Group?: {
    Id: number
    FetterGroupName?: string
  }
}

interface RawEchoFetterDetail {
  EffectDescriptions?: string[]
}

export interface RawEchoDetail {
  MonsterId?: number
  ItemId?: number
  MonsterName?: string
  Rarity?: number
  Icon?: string
  Element?: { Name?: string }
  AttributesDescription?: string
  Skill?: RawEchoSkill
  FetterGroupDetails?: RawEchoGroupDetail[]
  FetterDetails?: Record<string, RawEchoFetterDetail>
}

export function toWeaponSummary(raw: RawWeaponSummary): EncoreWeaponSummary {
  return {
    id: raw.Id,
    name: raw.Name,
    rarity: raw.QualityId ?? 0,
    type: raw.Type ?? 0,
    typeName: raw.TypeName ?? "",
    icon: encoreAssetUrl(raw.Icon),
  }
}

function toWeaponBreach(raw: RawWeaponBreach): EncoreWeaponBreach {
  return {
    id: raw.Id,
    level: raw.Level ?? 0,
    levelLimit: raw.LevelLimit ?? 0,
    items: raw.Items ?? [],
  }
}

export function toWeaponDetail(raw: RawWeaponDetail): EncoreWeaponDetail {
  return {
    id: raw.ItemId,
    name: raw.WeaponName ?? "",
    rarity: raw.QualityId ?? 0,
    type: raw.WeaponType ?? 0,
    typeName: raw.WeaponTypeName ?? "",
    icon: encoreAssetUrl(raw.Icon),
    description: raw.AttributesDescription || raw.BgDescription || "",
    effect: raw.Desc ?? "",
    properties: (raw.Properties ?? []).map(toProperty),
    breaches: (raw.Breaches ?? []).map(toWeaponBreach),
  }
}

export function toEchoSummary(raw: RawEchoSummary): EncoreEchoSummary {
  return {
    id: raw.Id,
    name: raw.Name,
    rarity: raw.Rarity ?? 0,
    element: raw.Element?.Name ?? "",
    icon: raw.Icon ?? "",
    sets: (raw.FetterGroups ?? []).map((group) => ({
      id: group.Id,
      name: group.Name ?? "",
      icon: encoreAssetUrl(group.Icon),
      effects: (group.Fetters ?? []).map((fetter) => ({
        key: fetter.Key,
        description: fetter.EffectDescription ?? "",
      })),
    })),
  }
}

function toEchoSetEffects(descriptions: string[] = []) {
  return descriptions.map((description, index) => ({
    key: index === 0 ? 2 : 5,
    description,
  }))
}

function toEchoDetailSets(raw: RawEchoDetail): EncoreEchoSet[] {
  const details = raw.FetterDetails ?? {}
  const groups = raw.FetterGroupDetails ?? []

  if (groups.length > 0) {
    return groups.map((entry) => {
      const name = entry.Group?.FetterGroupName ?? ""
      return {
        id: entry.Group?.Id ?? 0,
        name,
        icon: "",
        effects: toEchoSetEffects(details[name]?.EffectDescriptions),
      }
    })
  }

  return Object.entries(details).map(([name, detail], index) => ({
    id: index,
    name,
    icon: "",
    effects: toEchoSetEffects(detail.EffectDescriptions),
  }))
}

export function toEchoDetail(raw: RawEchoDetail): EncoreEchoDetail {
  const skill = raw.Skill

  return {
    id: raw.MonsterId ?? raw.ItemId ?? 0,
    name: raw.MonsterName ?? "",
    rarity: raw.Rarity ?? 0,
    element: raw.Element?.Name ?? "",
    icon: encoreAssetUrl(raw.Icon),
    description: raw.AttributesDescription ?? "",
    sets: toEchoDetailSets(raw),
    skill: skill
      ? {
          description: skill.DescriptionEx ?? skill.SimplyDescription ?? "",
          cooldown: skill.SkillCD ?? 0,
          damage: skill.DamageList ?? [],
        }
      : null,
  }
}

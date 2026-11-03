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
import {
  echoTier,
  type EncoreEchoDetail,
  type EncoreEchoSet,
  type EncoreEchoSummary,
} from "../domain/echo"
import { encoreAssetUrl } from "../domain/asset"
import type { EncoreProperty } from "../domain/property"
import type {
  EncoreWeaponDetail,
  EncoreWeaponRefinement,
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

export interface RawWeaponDetail {
  ItemId: number
  WeaponName?: string
  QualityId?: number
  WeaponType?: number
  WeaponTypeName?: string
  Icon?: string
  /** Passive title shared by the five refinement ranks. */
  ResonName?: string
  /** Passive template with one highlighted value list per rank. */
  Desc?: string
  AttributesDescription?: string
  BgDescription?: string
  Properties?: RawProperty[]
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
  phantomsList?: RawEchoSummary[]
}

interface RawEchoSkill {
  DescriptionEx?: string
  SimplyDescription?: string
  SkillCD?: number
  DamageList?: unknown[]
}

interface RawEchoFetterMapEntry {
  Key: number
  Value: number
}

interface RawEchoGroupDetail {
  Group?: {
    Id: number
    FetterGroupName?: string
    FetterElementColor?: string
    FetterElementPath?: string
    /** `Key` is the piece threshold: 1, 2, 3 or 5. */
    FetterMap?: RawEchoFetterMapEntry[]
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

/** Refinement ranks every weapon has: 1 to 5. */
const WEAPON_REFINEMENT_RANKS = 5
const HIGHLIGHTED_VALUES = /<span[^>]*>(.*?)<\/span>/g

/**
 * Expands a `Desc` template into one effect per refinement rank.
 *
 * Every highlighted span holds the slash-separated values of the five ranks
 * (`"12%/15%/18%/21%/24%"`); the rest of the text is shared. Only the
 * highlighted value changes, so the span markup is kept and the builder can
 * still render the emphasis. `DescParams` repeats those values, but Encore
 * sometimes sends them in a different order than the spans (Defier's Thorn,
 * Solar Flame), so each span itself is the source of truth. A span with fewer
 * values than ranks reuses its last one.
 */
function toWeaponRefinements(
  desc: string,
  name: string
): EncoreWeaponRefinement[] {
  const spans = [...desc.matchAll(HIGHLIGHTED_VALUES)]

  return Array.from({ length: WEAPON_REFINEMENT_RANKS }, (_, index) => {
    let cursor = 0
    let effect = ""

    for (const span of spans) {
      const start = span.index ?? 0
      const values = (span[1] ?? "").split("/")
      const value = values[index] ?? values[values.length - 1] ?? ""
      const openTag = span[0].slice(0, span[0].indexOf(">") + 1)

      effect += desc.slice(cursor, start)
      effect += `${openTag}${value}</span>`
      cursor = start + span[0].length
    }

    return {
      rank: index + 1,
      name,
      effect: effect + desc.slice(cursor),
      stats: [],
    }
  })
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
    properties: (raw.Properties ?? []).map(toProperty),
    refinements: toWeaponRefinements(raw.Desc ?? "", raw.ResonName ?? ""),
  }
}

export function toEchoSummary(raw: RawEchoSummary): EncoreEchoSummary {
  const tier = echoTier(raw.Rarity ?? 0)

  return {
    id: raw.Id,
    name: raw.Name,
    class: tier.class,
    cost: tier.cost,
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
  const tier = echoTier(raw.Rarity ?? 0)

  return {
    id: raw.MonsterId ?? raw.ItemId ?? 0,
    name: raw.MonsterName ?? "",
    class: tier.class,
    cost: tier.cost,
    icon: encoreAssetUrl(raw.Icon),
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

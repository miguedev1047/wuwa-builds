/**
 * Domain model for Wuthering Waves resonators.
 *
 * Pure types only: no filesystem, no HTTP. The shapes mirror what Prydwen
 * publishes (and what this app consumes) without leaking infrastructure
 * details into the rest of the codebase.
 */

export type HtmlString = string

export interface WeaponBuild {
  ID: number
  Character: string
  Weapon: string
  Dupes: number
  Percentage: string
  Percentage_2: string
  Comment: string
}

export interface EchoBuild {
  ID: number
  Character: string
  Type: string
  Set: string
  Percentage: string
  Set_small_1: string
  Set_small_2: string
  Set_small_3: string
  Set_small_4: string
  Set_small_5: string
  Comment: string
  Echo_1: string
  Echo_1_Comment: string
  Echo_2: string
  Echo_2_Comment: string
}

export interface EchoStatBuild {
  ID: number
  Name: string
  Character: string
  Format: number
  Slot_4: string
  Substats: string
  Echo_1: string
  Echo_2: string
  Echo_3: string
  Echo_4: string
  Echo_5: string
  Comments: string
}

export interface SkillOrder {
  ID: number
  Character: string
  Type: string
  Order: string
  Comments: string
}

export interface TeamComp {
  ID: number
  Character: string
  Name: string
  Member_1: string
  Member_2: string
  Member_3: string
  Comments: string
}

export interface Synergy {
  ID: number
  Character: string
  Synergy: string
  Comment: string
}

export interface ResonatorStats {
  slug: string
  name: string
  unit_id: number
  base_hp: number
  base_atk: number
  base_def: number
  base_crit: number
  base_critdmg: number
  base_healing: number
  max_energy: number
  bonus_hp: number
  bonus_atk: number
  bonus_def: number
  bonus_crit: number
  bonus_critdmg: number
  bonus_heal: number
  bonus_ele: number
}

export interface SkillMultiplier {
  Name: string
  [level: string]: string | number
}

export interface ResonatorSkill {
  name: string
  category: string
  skill_type: string
  type?: string
  description: HtmlString
  multipliers?: SkillMultiplier[]
  [key: string]: unknown
}

export interface AttributeBonus {
  name: string
  value: number
}

export interface VoiceActors {
  en: string
  jpn: string
  cn: string
  kr: string
}

export interface SequenceNode {
  name?: string
  description?: HtmlString
  [key: string]: unknown
}

export interface ResonatorProfile {
  id: string
  slug: string
  name: string
  rarity: number
  element: string
  weapon: string
  devId: number
  upcoming: boolean
  updatedAt: string
  introduction: HtmlString
  review: HtmlString
  pros: HtmlString
  cons: HtmlString
  endgameStats: HtmlString
  rotations: HtmlString
  heroHeadline: string
  imageAltText: string
  statBonusType: string
  skills: ResonatorSkill[]
  dupes: Record<string, string | SequenceNode>
  voiceActors: VoiceActors
  attributeBonus: AttributeBonus[]
  ascensionMaterials: Record<string, Record<string, number>>
  sequenceReview: Record<string, unknown>
  buildNote: Record<string, unknown>
  teamsNote: Record<string, unknown>
  synergyNote: Record<string, unknown>
  calculationsNotes: Record<string, unknown>
  videos: Record<string, unknown>
  [key: string]: unknown
}

export interface ResonatorBuild {
  lastUpdate: { slug: string; build: number; review: number } | null
  weapons: WeaponBuild[]
  echoes: EchoBuild[]
  echoStats: EchoStatBuild[]
  skillPriority: SkillOrder[]
  teams: TeamComp[]
  synergies: Synergy[]
}

export interface Ranking {
  slug: string
  name: string
  disclaimer: string
  damage: Record<string, number>
  dps: Record<string, number>
  time: string
  echo_main: string
  echo_4: string
  echo_3: string
  echo_3a: string
  echo_1: string
  echo_1a: string
  substats: string
  set_1: string
  set_2: string
  weapon: string
  weapon_S: number
}

export interface Calculation {
  teamName: string
  ranking: Ranking
  team: Record<string, unknown> | null
  comments: string
}

export type DamageDistribution = (string | number)[][]

export interface Weapon {
  Name: string
  Slug: string
  Rarity: number
  ID: string
  Effect: HtmlString
  Weapon_Type: string
  Stat_primary: number
  Stat_secondary: string
  Stat_secondary_value: number
  Source: string
  [key: string]: string | number | string[]
}

export interface Echo {
  ID: string
  Name: string
  Slug: string
  Rarity: number
  Echo_skill: HtmlString
  Sonata_Group?: string
  [key: string]: unknown
}

export interface EchoSet {
  name: string
  slug: string
  sonata_id: number
  type: string
  aliases: string
  imageUrl: string
  bonus_2: HtmlString
  bonus_3: HtmlString
  bonus_5: HtmlString
}

export interface TierConfigEntry {
  name: string
  label: string
  color: string
  minRating: number
}

export interface ResonatorReference {
  weapons: Weapon[]
  echoes: Echo[]
  echoSets: EchoSet[]
  tierConfig: TierConfigEntry[]
  headings: Record<string, unknown>
}

export interface Rating {
  id: number
  name: string
  slug: string
  rarity: number
  element: string
  weapon: string
  dupes: string
  toa_cat: string
  toa_rating: number
  toa_tags: string
  toa_marks: string
  toa_expert: boolean
  ww_cat: string
  ww_rating: number
  ww_tags: string
  ww_marks: string
  ww_expert: boolean
  overall_cat: string
  overall_rating: number
  overall_tags: string
  overall_marks: string
  sequence_display?: string
  toa_expert_column?: string
}

export interface Resonator {
  source: string
  fetchedAt: string
  slug: string
  name: string
  rarity: number
  element: string
  weapon: string
  upcoming: boolean
  updatedAt: string | null
  images: {
    card: string | null
    full: string | null
  }
  profile: ResonatorProfile
  build: ResonatorBuild
  stats: ResonatorStats | null
  calculations: Calculation[]
  damageDistribution: DamageDistribution
  reference: ResonatorReference
  valueRatings: Rating[]
}

export interface TierRating {
  category: string | null
  rating: number | null
  tags: string | null
  marks: string | null
  expert?: boolean
}

export interface ResonatorTiers {
  towerOfAdversity: TierRating
  whimperingWastes: TierRating
  overall: TierRating
}

export interface ResonatorIndexEntry {
  slug: string
  name: string
  rarity: number
  element: string
  cardImage: string | null
  dupes: string | null
  tiers: ResonatorTiers | null
}

export interface ResonatorIndex {
  source: string
  fetchedAt: string
  count: number
  characters: ResonatorIndexEntry[]
}

export interface CharacterCard {
  slug: string
  name: string
  rarity: number
  element: string
  cardImage: string
}

export interface ScrapeOptions {
  force?: boolean
  only?: string[]
  limit?: number
  concurrency?: number
  delayMs?: number
  /** Overrides the default `src/data/wuwa-resonators` directory (CLI only). */
  outDir?: string
}

/** Input accepted by the server function: no filesystem paths from the client. */
export type ScrapeRequest = Omit<ScrapeOptions, "outDir">

export type ScrapeEvent =
  | { kind: "listing"; total: number }
  | {
      kind: "character"
      slug: string
      done: number
      total: number
      status: "scraped" | "cached" | "failed"
      error?: string
    }
  | { kind: "index"; count: number }

export interface ScrapeReport {
  total: number
  scraped: number
  cached: number
  failed: { slug: string; error: string }[]
  indexCount: number
  directory: string
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export function isResonatorSlug(value: string): boolean {
  return SLUG_PATTERN.test(value)
}

import type { BuildProps, EchoesDataProps } from "@builds/domain/build-record"
import type { ResonatorPassivesDataProps } from "@builds/domain/build-record"
import type { CharacterDetail } from "@game-data/domain/character"
import type { EchoDetail, EchoSummary } from "@game-data/domain/echo"
import type { SonataCatalogEntry } from "@game-data/domain/sonata"
import type { WeaponDetail } from "@game-data/domain/weapon"
import type {
  EchoSkillBonusRow,
  ResonatorPassiveRow,
  ResonatorPropertyGrowthRow,
  ResonatorPropertyRow,
  ResonatorSequenceRow,
  SonataSetEffectRow,
  WeaponPropertyGrowthRow,
  WeaponPropertyRow,
  WeaponRefinementRow,
  WeaponRefinementStatRow,
} from "@db/schema"

const dates = { createdAt: new Date(0), updatedAt: new Date(0) }

interface GrowthValue {
  level: number
  value: number | string
}

function growthRows(values: GrowthValue[]): ResonatorPropertyGrowthRow[] {
  return values.map((entry, index) => ({
    id: index + 1,
    propertyId: 1,
    sortOrder: index,
    level: entry.level,
    valueNumber: typeof entry.value === "number" ? entry.value : null,
    valueText: typeof entry.value === "string" ? entry.value : null,
    ...dates,
  }))
}

/** Resonator property fixture with real level breakpoints. */
export function resonatorProperty({
  name,
  baseValue,
  values,
}: {
  name: string
  baseValue: number
  values: GrowthValue[]
}): ResonatorPropertyRow & { growth: ResonatorPropertyGrowthRow[] } {
  return {
    id: 1,
    resonatorId: 1,
    sortOrder: 0,
    name,
    icon: "",
    baseValue,
    growth: growthRows(values),
    ...dates,
  }
}

/** Resonator sequence fixture. */
export function resonatorSequence({
  index,
  description = "",
}: {
  index: number
  description?: string
}): ResonatorSequenceRow {
  return {
    id: index,
    resonatorId: 1,
    sequenceId: index,
    sortOrder: index,
    index,
    name: `Secuencia ${index}`,
    description,
    icon: "",
    ...dates,
  }
}

/** Local build passive fixture. */
export function buildPassive(
  overrides: Partial<ResonatorPassivesDataProps> = {}
): ResonatorPassivesDataProps {
  return {
    id: 1,
    passiveId: 1,
    name: "Pasiva",
    value: 10,
    icon: "",
    type: "passive",
    enabled: true,
    ...overrides,
  }
}

/** Resonator detail fixture with the relations the calculation reads. */
export function characterDetail({
  id = 1,
  name = "Cartethyia",
  element = "aero",
  weaponType = "sword",
  properties = [],
  sequences = [],
  passives = [],
}: {
  id?: number
  name?: string
  element?: string
  weaponType?: string
  properties?: CharacterDetail["properties"]
  sequences?: ResonatorSequenceRow[]
  passives?: ResonatorPassiveRow[]
} = {}): CharacterDetail {
  return {
    id,
    name,
    introduction: "",
    rarity: 5,
    element,
    weaponType,
    icon: "",
    card: "",
    iconLarge: "",
    circle: "",
    portrait: "",
    media: [],
    tags: [],
    properties,
    skills: [],
    sequences,
    passives,
    ...dates,
  }
}

function weaponGrowthRows(values: GrowthValue[]): WeaponPropertyGrowthRow[] {
  return values.map((entry, index) => ({
    id: index + 1,
    propertyId: 1,
    sortOrder: index,
    level: entry.level,
    valueNumber: typeof entry.value === "number" ? entry.value : null,
    valueText: typeof entry.value === "string" ? entry.value : null,
    ...dates,
  }))
}

/** Weapon property fixture with real level breakpoints. */
export function weaponProperty({
  name,
  baseValue,
  values,
}: {
  name: string
  baseValue: number
  values: GrowthValue[]
}): WeaponPropertyRow & { growth: WeaponPropertyGrowthRow[] } {
  return {
    id: 1,
    weaponId: 1,
    sortOrder: 0,
    name,
    icon: "",
    baseValue,
    growth: weaponGrowthRows(values),
    ...dates,
  }
}

/** Weapon refinement fixture with its structured stats. */
export function weaponRefinement({
  rank,
  stats,
  effect = "",
}: {
  rank: number
  stats: { statName: string; statNumber: number }[]
  effect?: string
}): WeaponRefinementRow & { stats: WeaponRefinementStatRow[] } {
  return {
    id: rank,
    weaponId: 1,
    sortOrder: rank,
    name: "Pasiva",
    effect,
    stats: stats.map((stat, index) => ({
      id: index + 1,
      refinementId: rank,
      sortOrder: index,
      statName: stat.statName,
      statNumber: stat.statNumber,
      ...dates,
    })),
    ...dates,
  }
}

/** Weapon detail fixture with the relations the calculation reads. */
export function weaponDetail({
  properties = [],
  refinements = [],
}: {
  properties?: WeaponDetail["properties"]
  refinements?: WeaponDetail["refinements"]
} = {}): WeaponDetail {
  return {
    id: 1,
    name: "Arma",
    rarity: 5,
    type: 1,
    typeName: "Espada",
    icon: "",
    description: "",
    properties,
    refinements,
    ...dates,
  }
}

/** Echo skill bonus fixture. */
export function echoSkillBonus(
  overrides: Partial<EchoSkillBonusRow> = {}
): EchoSkillBonusRow {
  return {
    id: 1,
    echoId: 1,
    statId: "atk_percent",
    value: 10,
    requiresMainSlot: false,
    condition: "none",
    conditionValue: null,
    sortOrder: 0,
    ...dates,
    ...overrides,
  }
}

/** Echo detail fixture with the skill bonuses the calculation reads. */
export function echoDetail({
  id = 1,
  name = "Eco",
  cost = 4,
  skillBonuses = [],
}: {
  id?: number
  name?: string
  cost?: number
  skillBonuses?: EchoSkillBonusRow[]
} = {}): EchoDetail {
  return {
    id,
    name,
    class: 0,
    cost,
    icon: "",
    sets: [],
    skill: null,
    skillBonuses,
    ...dates,
  }
}

/** Sonata effect fixture. */
export function sonataEffect(
  overrides: Partial<SonataSetEffectRow> = {}
): SonataSetEffectRow {
  return {
    id: 1,
    setId: 1,
    pieces: 2,
    description: "",
    isConditional: false,
    statId: "atk_percent",
    value: 10,
    sortOrder: 0,
    ...dates,
    ...overrides,
  }
}

/** Sonata set fixture with its piece thresholds. */
export function sonataEntry({
  id = 1,
  name = "Set",
  effects = [],
}: {
  id?: number
  name?: string
  effects?: SonataSetEffectRow[]
} = {}): SonataCatalogEntry {
  return {
    id,
    name,
    icon: "",
    color: "",
    source: "manual",
    effects,
    ...dates,
  }
}

/** Echo summary fixture. */
export function echoSummary({
  id = 1,
  name = "Eco",
  cost = 4,
}: {
  id?: number
  name?: string
  cost?: number
} = {}): EchoSummary {
  return { id, name, class: 0, cost, icon: "", ...dates }
}

/** Equipped echo slot fixture. */
export function echoSlot(
  overrides: Partial<EchoesDataProps> = {}
): EchoesDataProps {
  return {
    data: echoSummary(),
    index: 0,
    echoSetId: null,
    mainStatStat: "",
    mainStatLabel: "",
    mainStatValue: 0,
    level: 25,
    cost: 4,
    substats: [],
    ...overrides,
  }
}

/** Local build fixture with an empty document. */
export function buildRecord(overrides: Partial<BuildProps> = {}): BuildProps {
  const createdAt = new Date(0).toISOString()

  return {
    buildId: "build-1",
    sessionId: "session-1",
    name: "Build",
    resonator: {
      level: 90,
      sequency: 0,
      data: null,
      skills: [],
      passives: [],
    },
    weapon: { level: 90, refinament: 1, data: null },
    echoes: [],
    mainEchoSlot: null,
    createdAt,
    updateAt: createdAt,
    ...overrides,
  }
}

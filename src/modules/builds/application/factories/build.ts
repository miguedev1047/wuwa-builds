import type {
  CharacterDetail,
  CharacterSummary,
} from "@/modules/game-data/domain/character"
import {
  CHARACTER_LEVEL_MAX,
  ECHO_LEVEL_MAX,
  ECHO_SLOT_COUNT,
  SKILL_LEVEL_MAX,
  SUBSTATS_PER_ECHO_MAX,
  WEAPON_LEVEL_MAX,
} from "../../domain/build"
import type {
  BuildProps,
  EchoesDataProps,
  ResonatorDataProps,
  ResonatorPassivesDataProps,
  ResonatorSkillsDataProps,
  WeaponDataProps,
} from "../../domain/build-record"

const ORDERED_PASSIVE_INDEX = [0, 1, 8, 2, 3, 4, 5, 9, 6, 7]
const DEFAULT_REFINEMENT_RANK = 1

/** Five empty echo slots with five empty substats each. */
export function createEmptyEchoes(): EchoesDataProps[] {
  return Array.from({ length: ECHO_SLOT_COUNT }).map((_, index) => ({
    data: null,
    echoSetId: null,
    mainStatStat: "",
    mainStatLabel: "",
    index,
    mainStatValue: 0,
    level: ECHO_LEVEL_MAX,
    cost: 0,
    substats: Array.from({ length: SUBSTATS_PER_ECHO_MAX }).map(
      (_, substatIndex) => ({
        index: substatIndex,
        valueStat: "",
        valueLabel: "",
        valueNumber: 0,
      })
    ),
  }))
}

/** Weapon defaults before the user picks one. */
export function createEmptyWeapon(): WeaponDataProps {
  return {
    level: WEAPON_LEVEL_MAX,
    refinament: DEFAULT_REFINEMENT_RANK,
    data: null,
  }
}

/** Resonator defaults before the user picks one. */
export function createEmptyResonator(): ResonatorDataProps {
  return {
    level: CHARACTER_LEVEL_MAX,
    sequency: 0,
    data: null,
    skills: [],
    passives: [],
  }
}

export interface CreateEmptyBuildInput {
  buildId: string
  sessionId: string
  createdAt: string
  name?: string
}

/** Build document with no resonator, weapon or echoes selected. */
export function createEmptyBuild({
  buildId,
  sessionId,
  createdAt,
  name = "Nueva build",
}: CreateEmptyBuildInput): BuildProps {
  return {
    buildId,
    sessionId,
    name,
    resonator: createEmptyResonator(),
    weapon: createEmptyWeapon(),
    echoes: createEmptyEchoes(),
    mainEchoSlot: null,
    createdAt,
    updateAt: createdAt,
  }
}

/** Configurable skill levels seeded from the catalog detail. */
export function createResonatorSkills(
  skills: CharacterDetail["skills"]
): ResonatorSkillsDataProps[] {
  return skills.map((skill) => ({
    id: skill.id,
    skillId: skill.skillId,
    level: SKILL_LEVEL_MAX,
  }))
}

/** Configurable passives seeded from the catalog detail. */
export function createResonatorPassives(
  resonator: CharacterDetail
): ResonatorPassivesDataProps[] {
  const rawPassives = [
    ...resonator.passives.map((passive) => ({
      id: passive.id,
      passiveId: passive.passiveId,
      name: passive.title,
      value: passive.valueNumber,
      icon: passive.icon,
      type: "passive" as const,
    })),
    ...resonator.skills.slice(5, 7).map((skill) => ({
      id: skill.id,
      passiveId: skill.skillId,
      name: skill.name,
      value: 0,
      icon: skill.icon,
      type: "skill" as const,
    })),
  ]

  return ORDERED_PASSIVE_INDEX.map((index) => rawPassives[index])
    .filter((item): item is NonNullable<typeof item> => item !== undefined)
    .map((item) => ({ ...item, enabled: true }))
}

export interface CreateResonatorDataInput {
  character: CharacterSummary
  detail: CharacterDetail
}

/** Resonator section seeded from the summary and its catalog detail. */
export function createResonatorData({
  character,
  detail,
}: CreateResonatorDataInput): ResonatorDataProps {
  return {
    level: CHARACTER_LEVEL_MAX,
    sequency: 0,
    data: character,
    skills: createResonatorSkills(detail.skills),
    passives: createResonatorPassives(detail),
  }
}

export interface CreateBuildFromCharacterInput extends CreateEmptyBuildInput {
  character: CharacterSummary
  detail: CharacterDetail
}

/** Build document created after choosing a resonator. */
export function createBuildFromCharacter({
  character,
  detail,
  ...input
}: CreateBuildFromCharacterInput): BuildProps {
  return {
    ...createEmptyBuild(input),
    resonator: createResonatorData({ character, detail }),
  }
}

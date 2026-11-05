import type { CharacterSkill } from "@/modules/game-data/domain/character"
import { SKILL_LEVEL_MAX, type SkillLevel } from "../../domain/build"

/**
 * Game order for upgradeable skills. The catalog returns them in a different
 * order and mixes inherent/outro/tune-break entries, so the type is the stable
 * selector here.
 */
export const UPGRADEABLE_SKILL_TYPES = [
  "Ataque normal",
  "Habilidad de resonancia",
  "Circuito del Forte",
  "Liberación de resonancia",
  "Habilidad Intro",
] as const

export type UpgradeableSkillType = (typeof UPGRADEABLE_SKILL_TYPES)[number]

export interface UpgradeableSkill {
  skillId: number
  type: UpgradeableSkillType
  name: string
}

/** Upgradeable skills in game order, resolved from a catalog character. */
export function getUpgradeableSkills(
  skills: CharacterSkill[]
): UpgradeableSkill[] {
  return UPGRADEABLE_SKILL_TYPES.flatMap((type) => {
    const skill = skills.find((candidate) => candidate.type === type)
    return skill ? [{ skillId: skill.skillId, type, name: skill.name }] : []
  })
}

/**
 * Build the initial `skillLevels` from a catalog character detail.
 *
 * Skill IDs are stable game IDs, so they are preferred over array indices:
 * catalog ordering can change without breaking saved builds.
 */
export function createDefaultSkillLevels(
  skills: CharacterSkill[],
  level = SKILL_LEVEL_MAX
): SkillLevel[] {
  return getUpgradeableSkills(skills).map((skill) => ({
    skillId: skill.skillId,
    level,
  }))
}

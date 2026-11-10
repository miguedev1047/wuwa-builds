import type {
  ResonatorPassivesDataProps,
  ResonatorSkillsDataProps,
} from "@builds/domain/build-record"
import { SKILL_LEVEL_MAX } from "@builds/domain/build"

/** Returns a copy with one skill level clamped and replaced. */
export function withSkillLevel(
  skills: ResonatorSkillsDataProps[],
  skillId: number,
  level: number
): ResonatorSkillsDataProps[] {
  const nextLevel = Math.min(Math.max(level, 1), SKILL_LEVEL_MAX)

  return skills.map((skill) =>
    skill.skillId === skillId ? { ...skill, level: nextLevel } : skill
  )
}

/** Returns a copy with one passive enabled or disabled. */
export function withPassiveEnabled(
  passives: ResonatorPassivesDataProps[],
  id: number,
  enabled: boolean
): ResonatorPassivesDataProps[] {
  return passives.map((passive) =>
    passive.id === id ? { ...passive, enabled } : passive
  )
}

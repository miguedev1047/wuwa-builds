import type {
  ResonatorPassivesDataProps,
  ResonatorSkillsDataProps,
} from "@build/domain/build-record"
import { SKILL_LEVEL_MAX, SKILL_LEVEL_MIN } from "@build/domain/build"

/** Returns a copy with one skill level clamped and replaced. */
export function withSkillLevel(
  skills: ResonatorSkillsDataProps[],
  skillId: number,
  level: number
): ResonatorSkillsDataProps[] {
  const nextLevel = Math.min(Math.max(level, SKILL_LEVEL_MIN), SKILL_LEVEL_MAX)

  return skills.map((skill) =>
    skill.skillId === skillId ? { ...skill, level: nextLevel } : skill
  )
}

/**
 * Returns a copy with one skill level moved by `delta`.
 *
 * The stepper works on steps, not on absolute levels, so the bounds stay in
 * one place: unknown skills and out-of-range steps never mutate the document.
 */
export function withSkillStep(
  skills: ResonatorSkillsDataProps[],
  skillId: number,
  delta: number
): ResonatorSkillsDataProps[] {
  const current = skills.find((skill) => skill.skillId === skillId)

  if (!current) return skills

  return withSkillLevel(skills, skillId, current.level + delta)
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

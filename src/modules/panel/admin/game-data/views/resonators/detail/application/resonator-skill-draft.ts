import type { ResonatorSkillRow } from "@db/schema"
import type { EncoreSkill } from "@encore/domain/character"
import type {
  ResonatorSkillInput,
  ResonatorSkillUpdateInput,
} from "@game-data/application/schemas"

/** Payloads for the selected Encore skills, in Encore order. */
export function resonatorSkillPayloads(
  selectedIds: string[],
  encoreSkills: EncoreSkill[],
  resonatorId: number,
  firstSortOrder: number
): ResonatorSkillInput[] {
  return encoreSkills
    .filter((skill) => selectedIds.includes(String(skill.id)))
    .map((skill, index) => ({
      resonatorId,
      skillId: skill.id,
      sortOrder: firstSortOrder + index,
      type: skill.type,
      name: skill.name,
      description: skill.description,
      icon: skill.icon,
      media: skill.media,
    }))
}

/** Maps a saved skill row to the edit form values. */
export function resonatorSkillDraftFromRow(
  skill: ResonatorSkillRow
): ResonatorSkillUpdateInput {
  return {
    id: skill.id,
    resonatorId: skill.resonatorId,
    skillId: skill.skillId,
    sortOrder: skill.sortOrder,
    type: skill.type,
    name: skill.name,
    description: skill.description,
    icon: skill.icon,
    media: skill.media,
  }
}

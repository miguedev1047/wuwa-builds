import type { ResonatorSkillRow } from "@/db/schema"
import type { EncoreSkill } from "@/modules/encore/domain/character"
import type { ResonatorSkillUpdateInput } from "@/modules/panel/admin/game-data/application/schemas"

/** Fills the skill form with an Encore skill. */
export function resonatorSkillDraftFromEncore(
  skill: EncoreSkill,
  resonatorId: number,
  sortOrder: number
): ResonatorSkillUpdateInput {
  return {
    id: 0,
    resonatorId,
    skillId: skill.id,
    sortOrder,
    type: skill.type,
    name: skill.name,
    description: skill.description,
    icon: skill.icon,
    media: skill.media,
  }
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

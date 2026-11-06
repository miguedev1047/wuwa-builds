import { z } from "zod"

/** Skill reference stored in a draft snapshot; no catalog relations copied. */
export const characterSkillSnapshotSchema = z.object({
  skillId: z.number().int().positive(),
  type: z.string(),
  name: z.string(),
})

/** Local-only snapshot used to render a draft before the catalog responds. */
export const characterSnapshotSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  icon: z.string(),
  iconLarge: z.string(),
  rarity: z.number().int(),
  element: z.string(),
  weaponType: z.string(),
  skills: z.array(characterSkillSnapshotSchema),
})

export type CharacterSkillSnapshot = z.infer<
  typeof characterSkillSnapshotSchema
>
export type CharacterSnapshot = z.infer<typeof characterSnapshotSchema>

/** Fields a catalog row must expose to build a snapshot. */
export interface CharacterSnapshotSource {
  id: number
  name: string
  icon: string
  iconLarge: string
  rarity: number
  element: string
  weaponType: string
  skills?: CharacterSkillSnapshot[]
}

/** Build the local snapshot without copying the rest of the catalog record. */
export function toCharacterSnapshot(
  character: CharacterSnapshotSource
): CharacterSnapshot {
  return {
    id: character.id,
    name: character.name,
    icon: character.icon,
    iconLarge: character.iconLarge,
    rarity: character.rarity,
    element: character.element,
    weaponType: character.weaponType,
    skills: (character.skills ?? []).map((skill) => ({
      skillId: skill.skillId,
      type: skill.type,
      name: skill.name,
    })),
  }
}

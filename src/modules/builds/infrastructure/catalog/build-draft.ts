import type { CharacterSkill } from "@/modules/game-data/domain/character"
import {
  buildDraftSchema,
  createEmptyBuildDraft,
  type BuildDraft,
} from "../../domain/build-draft"
import { createDefaultSkillLevels } from "./skill-levels"

/** Minimal catalog record the draft needs; the full detail is not stored. */
export interface BuildDraftCharacter {
  id: number
  name: string
  skills: CharacterSkill[]
}

export interface CreateBuildDraftFromCharacterInput {
  id: string
  character: BuildDraftCharacter
  createdAt: string
  name?: string
}

/** Seed provider-dependent defaults without storing the catalog record. */
export function createBuildDraftFromCharacter({
  id,
  character,
  createdAt,
  name,
}: CreateBuildDraftFromCharacterInput): BuildDraft {
  const emptyDraft = createEmptyBuildDraft({
    id,
    characterId: character.id,
    name: name ?? `${character.name} Build`,
    createdAt,
  })

  return buildDraftSchema.parse({
    ...emptyDraft,
    payload: {
      ...emptyDraft.payload,
      resonator: {
        ...emptyDraft.payload.resonator,
        skillLevels: createDefaultSkillLevels(character.skills),
      },
    },
  })
}

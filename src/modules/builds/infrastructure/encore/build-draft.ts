import type { EncoreCharacterDetail } from "@/modules/encore/domain/character"
import {
  buildDraftSchema,
  createEmptyBuildDraft,
  type BuildDraft,
} from "../../domain/build-draft"
import { createDefaultSkillLevels } from "./skill-levels"

export interface CreateBuildDraftFromEncoreCharacterInput {
  id: string
  character: EncoreCharacterDetail
  createdAt: string
  name?: string
}

/** Seed provider-dependent defaults without storing the provider record. */
export function createBuildDraftFromEncoreCharacter({
  id,
  character,
  createdAt,
  name,
}: CreateBuildDraftFromEncoreCharacterInput): BuildDraft {
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

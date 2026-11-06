import { z } from "zod"
import {
  BUILD_DOCUMENT_VERSION,
  buildPayloadSchema,
  createEmptyBuildPayload,
} from "./build"
import { characterSnapshotSchema } from "./character-snapshot"

/**
 * Local editor state. It contains catalog references and user selections, not
 * copied resonator, weapon, or echo records.
 */
export const buildDraftSchema = z.object({
  /** Local collection key; it can differ from the eventual D1 build ID. */
  id: z.string().min(1),
  /** Null until this draft has been saved to the server. */
  savedBuildId: z.string().min(1).nullable(),
  /** Numeric catalog character ID. */
  characterId: z.number().int().positive(),
  /**
   * Local-only display snapshot. It never reaches D1: the save contract only
   * sends `characterId` and `payload`.
   */
  characterSnapshot: characterSnapshotSchema.nullable().default(null),
  /** Drafts may be unnamed; the save contract validates the final name. */
  name: z.string().max(80),
  documentVersion: z.literal(BUILD_DOCUMENT_VERSION),
  payload: buildPayloadSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type BuildDraft = z.infer<typeof buildDraftSchema>

export interface CreateEmptyBuildDraftInput {
  id: string
  characterId: number
  createdAt: string
  name?: string
}

/** Create an empty, serializable editor model after the user picks a character. */
export function createEmptyBuildDraft(
  input: CreateEmptyBuildDraftInput
): BuildDraft {
  return buildDraftSchema.parse({
    id: input.id,
    savedBuildId: null,
    characterId: input.characterId,
    characterSnapshot: null,
    name: input.name ?? "",
    documentVersion: BUILD_DOCUMENT_VERSION,
    payload: createEmptyBuildPayload(),
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
  })
}

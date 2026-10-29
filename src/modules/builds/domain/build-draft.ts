import { z } from "zod"
import {
  BUILD_DOCUMENT_VERSION,
  buildPayloadSchema,
  createEmptyBuildPayload,
} from "./build"

/**
 * Local editor state. It contains catalog references and user selections, not
 * copied resonator, weapon, or echo records.
 */
export const buildDraftSchema = z.object({
  /** Local collection key; it can differ from the eventual D1 build ID. */
  id: z.string().min(1),
  /** Null until this draft has been saved to the server. */
  savedBuildId: z.string().min(1).nullable(),
  /** Numeric Encore character ID. */
  characterId: z.number().int().positive(),
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
    name: input.name ?? "",
    documentVersion: BUILD_DOCUMENT_VERSION,
    payload: createEmptyBuildPayload(),
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
  })
}

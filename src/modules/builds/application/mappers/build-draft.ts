import type { BuildRecord } from "../ports/build-repository"
import { buildDraftSchema, type BuildDraft } from "../../domain/build-draft"
import { BUILD_DOCUMENT_VERSION } from "../../domain/build"
import {
  createBuildInputSchema,
  updateBuildInputSchema,
  type CreateBuildInput,
  type UpdateBuildInput,
} from "../schemas"

/** Convert a saved server record into the UI-independent editor model. */
export function buildRecordToDraft(record: BuildRecord): BuildDraft {
  if (record.documentVersion !== BUILD_DOCUMENT_VERSION) {
    throw new Error(
      `Unsupported build document version: ${record.documentVersion}`
    )
  }

  return buildDraftSchema.parse({
    id: record.id,
    savedBuildId: record.id,
    characterId: record.characterId,
    name: record.name,
    documentVersion: record.documentVersion,
    payload: record.payload,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  })
}

/** Convert a new local draft to the public create contract (no local metadata). */
export function buildDraftToCreateInput(draft: BuildDraft): CreateBuildInput {
  if (draft.savedBuildId !== null) {
    throw new Error("A saved build must use the update contract")
  }

  return createBuildInputSchema.parse({
    characterId: draft.characterId,
    name: draft.name,
    payload: draft.payload,
  })
}

/** Convert an edited saved draft to the public update contract. */
export function buildDraftToUpdateInput(draft: BuildDraft): UpdateBuildInput {
  if (draft.savedBuildId === null) {
    throw new Error("An unsaved draft must use the create contract")
  }

  return updateBuildInputSchema.parse({
    buildId: draft.savedBuildId,
    name: draft.name,
    payload: draft.payload,
  })
}

import type { Collection } from "@tanstack/react-db"
import type { BuildDraft } from "../domain/build-draft"

/**
 * Legacy type for the pending detailed editor.
 *
 * Local builds now live in `buildCollection` (see
 * `infrastructure/local-storage/build-drafts`). This alias only keeps the old
 * draft-based editor components type-checking until they are migrated to
 * `BuildProps`.
 */
export type BuildDraftCollection = Collection<BuildDraft, string>

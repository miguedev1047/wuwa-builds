import {
  createCollection,
  localStorageCollectionOptions,
} from "@tanstack/react-db"
import { buildDraftSchema, type BuildDraft } from "../../domain/build-draft"

const BUILD_DRAFT_STORAGE_VERSION = 1

/**
 * Create a browser-local draft collection for one account scope.
 * Pass `window.localStorage` from client-only code; this module is safe to
 * import during SSR because it never accesses browser globals at module load.
 */
export function createBuildDraftCollection(scopeId: string, storage: Storage) {
  if (!scopeId.trim()) {
    throw new Error("A user or guest scope is required for build drafts")
  }

  const scope = encodeURIComponent(scopeId)

  return createCollection(
    localStorageCollectionOptions({
      id: `wuwa-build-drafts:${scope}`,
      storageKey: `wuwa:build-drafts:${scope}:v${BUILD_DRAFT_STORAGE_VERSION}`,
      getKey: (draft: BuildDraft) => draft.id,
      schema: buildDraftSchema,
      storage,
    })
  )
}

import {
  countUserBuilds,
  deleteBuild,
  insertBuild,
  updateBuild,
  type LocalBuildIdentity,
} from "@build/client/build-store"
import { useBuildsCollection } from "@build/client/builds-collection"
import type { BuildProps } from "@build/domain/build-record"

/** Build actions bound to the signed-in user's collection. */
export function useBuildStore(userId: string) {
  const collection = useBuildsCollection(userId)

  return {
    insert: (build: BuildProps) => insertBuild(collection, build),
    update: (
      identity: LocalBuildIdentity,
      updater: (draft: BuildProps) => void
    ) => updateBuild(collection, identity, updater),
    remove: (identity: LocalBuildIdentity) => deleteBuild(collection, identity),
    count: () => countUserBuilds(collection, userId),
  }
}

import { buildCollection } from "@build/infrastructure/local-storage/build-drafts"
import type { BuildProps } from "@build/domain/build-record"

export { buildCollection }

/** Insert a new local build. */
export function insertBuild(build: BuildProps): void {
  buildCollection.insert(build)
}

export type LocalBuildIdentity = Pick<BuildProps, "buildId" | "userId">

/** Update one local build owned by the current user. */
export function updateBuild(
  { buildId, userId }: LocalBuildIdentity,
  updater: (draft: BuildProps) => void
): boolean {
  if (buildCollection.get(buildId)?.userId !== userId) return false

  buildCollection.update(buildId, updater)
  return true
}

/** Delete one local build. */
export function deleteBuild({ buildId, userId }: LocalBuildIdentity): boolean {
  if (buildCollection.get(buildId)?.userId !== userId) return false

  buildCollection.delete(buildId)
  return true
}

/** Synchronous count used by creation guards. */
export function countUserBuilds(userId: string): number {
  let total = 0

  for (const build of buildCollection.values()) {
    if (build.userId === userId) total += 1
  }

  return total
}

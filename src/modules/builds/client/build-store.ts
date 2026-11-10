import { buildCollection } from "@builds/infrastructure/local-storage/build-drafts"
import type { BuildProps } from "@builds/domain/build-record"

export { buildCollection }

/** Insert a new local build. */
export function insertBuild(build: BuildProps): void {
  buildCollection.insert(build)
}

/** Update one local build. */
export function updateBuild(
  buildId: string,
  updater: (draft: BuildProps) => void
): void {
  buildCollection.update(buildId, updater)
}

/** Delete one local build. */
export function deleteBuild(buildId: string): void {
  buildCollection.delete(buildId)
}

/** Synchronous count used by creation guards. */
export function countSessionBuilds(sessionId: string): number {
  let total = 0

  for (const build of buildCollection.values()) {
    if (build.sessionId === sessionId) total += 1
  }

  return total
}

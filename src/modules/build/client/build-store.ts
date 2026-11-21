import type { BuildProps } from "@build/domain/build-record"

/** Minimal settlement handle exposed by a collection mutation. */
export interface BuildTransaction {
  when: (state: "settled") => Promise<unknown>
}

/**
 * Reactive store the build actions write to. The query collection satisfies it
 * structurally; tests use a small in-memory fake.
 */
export interface BuildDraftCollection {
  get(key: string): BuildProps | undefined
  values(): Iterable<BuildProps>
  insert(build: BuildProps): BuildTransaction
  update(key: string, updater: (draft: BuildProps) => void): unknown
  delete(key: string): BuildTransaction
}

export type LocalBuildIdentity = Pick<BuildProps, "buildId" | "userId">

/** Insert a build owned by the current user. */
export function insertBuild(
  collection: BuildDraftCollection,
  build: BuildProps
): BuildTransaction {
  return collection.insert(build)
}

/** Update one build only when it belongs to the current user. */
export function updateBuild(
  collection: BuildDraftCollection,
  { buildId, userId }: LocalBuildIdentity,
  updater: (draft: BuildProps) => void
): boolean {
  if (collection.get(buildId)?.userId !== userId) return false

  collection.update(buildId, updater)
  return true
}

/** Delete one build only when it belongs to the current user. */
export function deleteBuild(
  collection: BuildDraftCollection,
  { buildId, userId }: LocalBuildIdentity
): BuildTransaction | false {
  if (collection.get(buildId)?.userId !== userId) return false

  return collection.delete(buildId)
}

/** Synchronous count used by creation guards. */
export function countUserBuilds(
  collection: BuildDraftCollection,
  userId: string
): number {
  let total = 0

  for (const build of collection.values()) {
    if (build.userId === userId) total += 1
  }

  return total
}

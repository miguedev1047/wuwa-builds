import { buildsCollection } from "@build/client/builds-collection"
import {
  and,
  count,
  eq,
  groupKeys,
  isNull,
  not,
  useLiveSuspenseQuery,
} from "@tanstack/react-db"

/** Resonator group with its live build count. */
export type UserRoster = {
  resonatorId: number
  name: string
  iconLarge: string
  totalBuilds: number
}

/** One build filtered by user. */
export function useBuildCollection({
  buildId,
  userId,
}: {
  buildId: string
  userId: string
}) {
  const builds = buildsCollection(userId)

  return useLiveSuspenseQuery((q) =>
    q
      .from({ build: builds })
      .where(({ build }) =>
        and(eq(build.buildId, buildId), eq(build.userId, userId))
      )
      .findOne()
  )
}

/** Builds grouped by resonator, with a reactive count per roster. */
export function useUserRosters(userId: string) {
  const builds = buildsCollection(userId)

  return useLiveSuspenseQuery((q) =>
    q
      .from({ build: builds })
      .where(({ build }) =>
        and(eq(build.userId, userId), not(isNull(build.resonator.data)))
      )
      .groupBy(
        groupKeys(({ build }) => [
          build.resonator.data!.id,
          build.resonator.data!.name,
          build.resonator.data!.iconLarge,
        ])
      )
      .select(({ build }) => ({
        resonatorId: build.resonator.data!.id,
        name: build.resonator.data!.name,
        iconLarge: build.resonator.data!.iconLarge,
        totalBuilds: count(build.buildId),
      }))
  )
}

/** Builds that still do not have a resonator. */
export function useUnassignedBuilds(userId: string) {
  const builds = buildsCollection(userId)

  return useLiveSuspenseQuery((q) =>
    q
      .from({ build: builds })
      .where(({ build }) =>
        and(eq(build.userId, userId), isNull(build.resonator.data))
      )
      .orderBy(({ build }) => build.createdAt, "asc")
  )
}

/** Builds of one resonator for the current user. */
export function useRosterBuilds(rosterId: number, userId: string) {
  const builds = buildsCollection(userId)

  return useLiveSuspenseQuery((q) =>
    q
      .from({ build: builds })
      .where(({ build }) =>
        and(eq(build.resonator.data?.id, rosterId), eq(build.userId, userId))
      )
      .orderBy(({ build }) => build.createdAt, "asc")
  )
}

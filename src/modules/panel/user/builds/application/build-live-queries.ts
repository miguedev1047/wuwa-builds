import {
  and,
  count,
  eq,
  groupKeys,
  isNull,
  not,
  useLiveQuery,
  useLiveSuspenseQuery,
} from "@tanstack/react-db"
import { useRouteContext } from "@tanstack/react-router"
import { buildCollection } from "@builds/client/build-store"

/** Active panel session for local build operations. */
export function useSessionId() {
  const { session } = useRouteContext({ from: "/(panel)/panel" })

  return session.session.id
}

/** One local build filtered by session. */
export function useBuildCollection({ buildId }: { buildId: string }) {
  const sessionId = useSessionId()

  return useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(eq(build.buildId, buildId), eq(build.sessionId, sessionId))
      )
      .findOne()
  )
}

/** Number of local builds that belong to the current session. */
export function useSessionBuildCount(): number {
  const sessionId = useSessionId()

  const { data } = useLiveQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) => eq(build.sessionId, sessionId))
      .select(({ build }) => ({ total: count(build.buildId) }))
  )

  return data?.[0]?.total ?? 0
}

/** Builds grouped by resonator, with a reactive count per roster. */
export function useSessionRosters() {
  const sessionId = useSessionId()

  return useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(eq(build.sessionId, sessionId), not(isNull(build.resonator.data)))
      )
      .groupBy(
        groupKeys(({ build }) => [
          build.resonator.data!.id,
          build.resonator.data!.name,
          build.resonator.data!.icon,
        ])
      )
      .select(({ build }) => ({
        resonatorId: build.resonator.data!.id,
        name: build.resonator.data!.name,
        icon: build.resonator.data!.icon,
        totalBuilds: count(build.buildId),
      }))
  )
}

/** Builds that still do not have a resonator. */
export function useUnassignedBuilds() {
  const sessionId = useSessionId()

  return useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(eq(build.sessionId, sessionId), isNull(build.resonator.data))
      )
      .orderBy(({ build }) => build.createdAt, "asc")
  )
}

/** Builds of one resonator for the current session. */
export function useRosterBuilds(rosterId: number) {
  const sessionId = useSessionId()

  return useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(
          eq(build.resonator.data?.id, rosterId),
          eq(build.sessionId, sessionId)
        )
      )
      .orderBy(({ build }) => build.createdAt, "asc")
  )
}

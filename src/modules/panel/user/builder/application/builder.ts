import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import { and, eq, useLiveSuspenseQuery } from "@tanstack/react-db"
import { useRouteContext } from "@tanstack/react-router"

export function useBuildCollection({ buildId }: { buildId: string }) {
  const { session } = useRouteContext({ from: "/(panel)/panel" })

  const liveQuery = useLiveSuspenseQuery((q) =>
    q
      .from({ build: buildCollection })
      .where(({ build }) =>
        and(eq(build.buildId, buildId), eq(build.sessionId, session.session.id))
      )
      .findOne()
  )

  return liveQuery
}

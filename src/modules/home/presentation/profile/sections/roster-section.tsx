import { RouteNavigation } from "@/components/blocks/route-navigation"
import { Show } from "@/components/utility/show"
import { RosterContainer } from "@home/presentation/profile/components/roster-container"
import { profileQueries } from "@home/queries/profile"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Await } from "@tanstack/react-router"
import { Suspense } from "react"

interface RosterSectionProps {
  /** Profile account and current visitor, supplied by the route. */
  userId: string
  viewerId: string | null
  /** Signals completion of the authorized roster query. */
  ready: Promise<boolean>
}

/** Loads the roster region independently of the profile header. */
export function RosterSection({ ready, userId, viewerId }: RosterSectionProps) {
  return (
    <Suspense fallback={null}>
      <Await promise={ready}>
        {(available) => (
          <Show when={available}>
            <RosterContent userId={userId} viewerId={viewerId} />
          </Show>
        )}
      </Await>
    </Suspense>
  )
}

function RosterContent({
  userId,
  viewerId,
}: Omit<RosterSectionProps, "ready">) {
  const { data: rosters } = useSuspenseQuery(
    profileQueries.rosters(userId, viewerId)
  )

  if (rosters.length === 0) return null

  return (
    <RouteNavigation.Root variant="wide">
      <RouteNavigation.Content>
        <RosterContainer
          userId={userId}
          viewerId={viewerId}
          rosters={rosters}
        />
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}

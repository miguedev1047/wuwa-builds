import { ProfileNotFound, ProfilePending } from "@/routing/home/route-state"
import { Show } from "@/components/utility/show"
import { DotGridBackground } from "@home/presentation/profile/components/dot-grid-background"
import { ProfileSection } from "@home/presentation/profile/sections/profile-section"
import { RosterSection } from "@home/presentation/profile/sections/roster-section"
import { profileQueries } from "@home/queries/profile"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import { Await } from "@tanstack/react-router"

interface ProfilePageProps {
  /** Profile account and the current visitor, supplied by the route. */
  userId: string
  viewerId: string | null
  /** Signals that access was checked for this navigation. */
  profileReady: Promise<boolean>
  /** Signals that the authorized roster query is ready to read. */
  rostersReady: Promise<boolean>
}

/** Keeps the profile shell visible while its authorized data loads. */
export function ProfilePage({ profileReady, ...props }: ProfilePageProps) {
  return (
    <main className="relative space-y-10">
      <Await promise={profileReady} fallback={<ProfilePending />}>
        {(allowed) => (
          <>
            <DotGridBackground />
            <Show when={allowed} fallback={<ProfileNotFound />}>
              <ProfileContent {...props} />
            </Show>
          </>
        )}
      </Await>
    </main>
  )
}

function ProfileContent({
  userId,
  viewerId,
  rostersReady,
}: Omit<ProfilePageProps, "profileReady">) {
  const queryClient = useQueryClient()
  const { data: profile } = useSuspenseQuery(
    profileQueries.detail(userId, viewerId)
  )

  const onSaved = async () => {
    queryClient.invalidateQueries(
      { queryKey: profileQueries.detailKey(userId) },
      { throwOnError: true }
    )
  }

  return (
    <Show when={profile} fallback={<ProfileNotFound />}>
      {(current) => (
        <>
          <ProfileSection profile={current} onSaved={onSaved} />
          <RosterSection
            userId={userId}
            viewerId={viewerId}
            ready={rostersReady}
          />
        </>
      )}
    </Show>
  )
}

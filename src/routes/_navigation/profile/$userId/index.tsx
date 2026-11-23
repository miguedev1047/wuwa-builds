import {
  loadProfileAccess,
  preloadProfileRosters,
} from "@/routing/home/profile/profile-loader"
import { ProfilePage } from "@/routing/home/profile/profile-page"
import { ProfileNotFound, ProfilePending } from "@/routing/home/route-state"
import { profileLookupInput } from "@home/application/profile/profile-lookup"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { createIsomorphicFn } from "@tanstack/react-start"

const isServer = createIsomorphicFn()
  .server(() => true)
  .client(() => false)

export const Route = createFileRoute("/_navigation/profile/$userId/")({
  component: RouteComponent,
  pendingComponent: ProfilePending,
  notFoundComponent: ProfileNotFound,

  headers: () => ({ "Cache-Control": "private, no-store" }),
  preloadStaleTime: 0,
  staleTime: 0,
  gcTime: 0,
  loader: {
    staleReloadMode: "blocking",
    handler: async ({ context, params, preload }) => {
      const input = profileLookupInput.safeParse(params)
      if (!input.success) throw notFound()

      const { queryClient, user } = context
      const { userId } = input.data

      const viewerId = user?.id ?? null

      const profileReady = loadProfileAccess(queryClient, userId, viewerId)

      if (isServer() && !(await profileReady)) throw notFound()

      if (preload) await profileReady

      const rostersReady = preloadProfileRosters(
        queryClient,
        userId,
        viewerId,
        profileReady
      )

      return { profileReady, rostersReady }
    },
  },
})

function RouteComponent() {
  const { profileReady, rostersReady } = Route.useLoaderData()
  const { userId } = Route.useParams()

  const { user } = Route.useRouteContext()

  return (
    <ProfilePage
      key={JSON.stringify([userId, user?.id ?? null])}
      userId={userId}
      viewerId={user?.id ?? null}
      profileReady={profileReady}
      rostersReady={rostersReady}
    />
  )
}

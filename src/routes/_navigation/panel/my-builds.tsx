import { buildCollection } from "@build/client/build-store"
import { MyBuildsPage } from "@/routing/build/my-builds/my-builds-page"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
  MyBuildsRouteError,
  MyBuildsRouteNotFound,
  MyBuildsRoutePending,
} from "@/routing/build/my-builds-route-state"

export const Route = createFileRoute("/_navigation/panel/my-builds")({
  component: RouteComponent,
  ssr: false,
  pendingComponent: MyBuildsRoutePending,
  errorComponent: MyBuildsRouteError,
  notFoundComponent: MyBuildsRouteNotFound,
  loader: async () => {
    await buildCollection.preload()
  },
})

function RouteComponent() {
  const { session } = Route.useRouteContext()
  const navigate = useNavigate()

  return (
    <MyBuildsPage
      user={session.user}
      onCreated={(buildId) => {
        void navigate({
          to: "/panel/builder/$buildId",
          params: { buildId },
        })
      }}
    />
  )
}

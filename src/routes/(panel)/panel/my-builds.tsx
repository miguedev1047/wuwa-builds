import { buildCollection } from "@build/client/build-store"
import { MyBuildsPage } from "@build/presentation/collection/components/my-builds-page"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { NavigationApp } from "@/components/blocks/navigation-app"
import { Suspense } from "react"
import { Spinner } from "@/components/panelui/spinner"
import {
  MyBuildsRouteError,
  MyBuildsRouteNotFound,
  MyBuildsRoutePending,
} from "@/routing/build/my-builds-route-state"

export const Route = createFileRoute("/(panel)/panel/my-builds")({
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
    <main>
      <NavigationApp user={session.user} />
      <Suspense fallback={<Spinner />}>
        <MyBuildsPage
          user={session.user}
          onCreated={(buildId) => {
            void navigate({
              to: "/panel/builder/$buildId",
              params: { buildId },
            })
          }}
        />
      </Suspense>
    </main>
  )
}

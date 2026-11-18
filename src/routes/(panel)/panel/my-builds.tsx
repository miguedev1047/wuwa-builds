import { buildCollection } from "@build/client/build-store"
import { MyBuildsPage } from "@build/presentation/collection/components/my-builds-page"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { NavigationApp } from "@/components/blocks/navigation-app"

export const Route = createFileRoute("/(panel)/panel/my-builds")({
  component: RouteComponent,
  ssr: false,
  loader: async () => {
    await buildCollection.preload()
  },
})

function RouteComponent() {
  const { session } = Route.useRouteContext()
  const navigate = useNavigate()

  return (
    <main className="space-y-10">
      <NavigationApp user={session.user} />
      <MyBuildsPage
        user={session.user}
        onCreated={(buildId) => {
          void navigate({ to: "/panel/builder/$buildId", params: { buildId } })
        }}
      />
    </main>
  )
}

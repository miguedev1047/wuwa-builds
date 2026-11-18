import { buildCollection } from "@build/client/build-store"
import { MyBuildsPage } from "@build/presentation/collection/components/my-builds-page"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

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
    <MyBuildsPage
      sessionId={session.session.id}
      userName={session.user.name}
      onCreated={(buildId) => {
        void navigate({ to: "/panel/builder/$buildId", params: { buildId } })
      }}
    />
  )
}

import { BuildDraftsProvider } from "@/modules/builds/client/build-drafts-provider"
import { getSession } from "@/functions/auth"
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession()

    if (!session) {
      throw redirect({ to: "/auth/login" })
    }

    return { session }
  },
})

function RouteComponent() {
  const { session } = Route.useRouteContext()

  return (
    <BuildDraftsProvider scopeId={session.user.id}>
      <div className="mx-auto max-w-5xl py-20">
        <Outlet />
      </div>
    </BuildDraftsProvider>
  )
}

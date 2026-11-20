import { NavigationApp } from "@/components/blocks/navigation-app"
import { getSession } from "@/functions/auth"
import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_navigation")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession()
    const user = session?.user

    return { user }
  },
})

function RouteComponent() {
  const { user } = Route.useRouteContext()

  return (
    <>
      <NavigationApp user={user} />
      <Outlet />
    </>
  )
}

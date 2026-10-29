import { Button } from "@/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel/my-builds")({
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = Route.useRouteContext()
  const user = session.user

  return (
    <div className="space-y-4">
      <h2>Hola {user.name}. Bienvenido al panel.</h2>

      <Button nativeButton={false} render={<Link to="/panel/new-build" />}>
        Nueva Build
      </Button>
    </div>
  )
}

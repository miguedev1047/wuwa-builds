import { Button } from "@/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/")({
  component: RouteComponent,
})

function RouteComponent() {
  const { session } = Route.useRouteContext()
  const user = session.user

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2>Hola {user.name}. Bienvenido a la pagina de administrador</h2>
      </div>

      <div className="grid gap-4">
        <Button
          className="flex h-40 w-full items-center justify-center text-4xl font-bold"
          nativeButton={false}
          render={<Link to="/admin/resonators" />}
        >
          Resonadores
        </Button>
        <Button
          className="flex h-40 w-full items-center justify-center text-4xl font-bold"
          nativeButton={false}
          render={<Link to="/admin/weapons" />}
        >
          Armas
        </Button>
        <Button
          className="flex h-40 w-full items-center justify-center text-4xl font-bold"
          nativeButton={false}
          render={<Link to="/admin/echoes" />}
        >
          Ecos
        </Button>
      </div>
    </div>
  )
}

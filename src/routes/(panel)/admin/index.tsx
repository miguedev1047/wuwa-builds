import { Button } from "@/components/ui/button"
import { characterQueries } from "@/modules/encore/queries/characters"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/")({
  component: RouteComponent,
  loader: async ({ context }) => {
    await context.queryClient.query(characterQueries.list())
  },
})

function RouteComponent() {
  const { session } = Route.useRouteContext()
  const user = session.user

  return (
    <div className="mx-auto max-w-5xl py-20">
      <div className="space-y-4">
        <h2>Hola {user.name}. Bienvenido a la pagina de administrador</h2>
        <Button
          nativeButton={false}
          render={<Link to="/admin/resonators">Ver resonadores</Link>}
        />
      </div>
    </div>
  )
}

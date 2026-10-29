import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel/my-builds/b/$characterId")(
  {
    component: RouteComponent,
  }
)

function RouteComponent() {
  const { characterId } = Route.useParams()

  return <div>Builds del personaje {characterId}</div>
}

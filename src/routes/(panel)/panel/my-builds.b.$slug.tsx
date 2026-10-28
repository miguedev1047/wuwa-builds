import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel/my-builds/b/$slug")({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(panel)/panel/my-builds/b/$slug"!</div>
}

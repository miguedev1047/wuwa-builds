import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel/builder")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Outlet />
    </div>
  )
}

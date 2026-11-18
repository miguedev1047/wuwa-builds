import { Outlet } from "@tanstack/react-router"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/weapons")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto max-w-5xl px-4 md:px-8">
      <Outlet />
    </div>
  )
}

import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="mx-auto max-w-5xl py-20">
      <Outlet />
    </div>
  )
}

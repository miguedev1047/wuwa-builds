import { Button } from "@/components/ui/button"
import { createFileRoute, Link } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel/my-builds")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-4">
      <Button nativeButton={false} render={<Link to="/panel/new-build" />}>
        New build
      </Button>
      <div>Your builds component</div>
    </div>
  )
}

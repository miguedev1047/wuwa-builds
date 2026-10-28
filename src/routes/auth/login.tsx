import { LoginCard } from "@/modules/login/components/login-card"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
})

function RouteComponent() {
  return <LoginCard />
}

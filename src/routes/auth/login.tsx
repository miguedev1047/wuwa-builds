import { getSession } from "@/functions/auth"
import { LoginCard } from "@/modules/login/components/login-card"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await getSession()

    if (session) {
      throw redirect({ to: "/panel" })
    }
  },
})

function RouteComponent() {
  return <LoginCard />
}

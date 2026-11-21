import { getSession } from "@/functions/auth"
import { LoginPage } from "@/routing/auth/login/login-page"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Iniciar sesión | Wuwa Builds" },
      { name: "robots", content: "noindex" },
    ],
  }),
  beforeLoad: async () => {
    const session = await getSession()

    if (session) {
      throw redirect({ to: "/panel" })
    }
  },
})

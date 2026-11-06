import { getSession } from "@/functions/auth"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel")({
  beforeLoad: async () => {
    const session = await getSession()

    if (!session) {
      throw redirect({ to: "/auth/login" })
    }

    return { session }
  },
})

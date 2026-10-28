import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel/")({
  beforeLoad: () => {
    throw redirect({ to: "/panel/my-builds" })
  },
})

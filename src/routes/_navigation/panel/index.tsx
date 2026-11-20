import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_navigation/panel/")({
  beforeLoad: () => {
    throw redirect({ to: "/panel/my-builds" })
  },
})

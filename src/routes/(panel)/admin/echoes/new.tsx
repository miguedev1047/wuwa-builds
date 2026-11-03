import { EchoNewPage } from "@/modules/panel/admin/game-data/views/echoes/new/page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/echoes/new")({
  component: () => <EchoNewPage />,
})

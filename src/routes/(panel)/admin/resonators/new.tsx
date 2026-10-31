import { ResonatorNewPage } from "@/modules/panel/admin/game-data/views/resonators/new/page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/resonators/new")({
  component: () => <ResonatorNewPage />,
})

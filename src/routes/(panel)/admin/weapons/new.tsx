import { WeaponNewPage } from "@panel/admin/game-data/views/weapons/new/page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/weapons/new")({
  component: () => <WeaponNewPage />,
})

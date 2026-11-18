import { AdminMenuPage } from "@/routing/catalog/admin-menu-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/")({
  component: AdminMenuPage,
})

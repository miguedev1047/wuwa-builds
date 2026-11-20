import { AdminHomePage } from "@/routing/catalog/home/admin-home-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_navigation/admin/")({
  component: AdminHomePage,
})

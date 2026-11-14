import { CatalogSectionDockActions } from "@/routing/catalog/catalog-dock"
import { echoNewDockActions } from "@/routing/catalog/echoes/new/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { EchoNew } from "@catalog/presentation/echoes/new/echo-new"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/echoes/new")({
  component: () => (
    <CatalogNavigation entity="echoes">
      <EchoNew />
      <CatalogSectionDockActions items={echoNewDockActions} />
    </CatalogNavigation>
  ),
})

import { ActionDock } from "@/components/blocks/action-dock"
import { echoNewDockActions } from "@/routing/catalog/echoes/new/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { EchoNew } from "@catalog/presentation/echoes/new/echo-new"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_navigation/admin/echoes/new")({
  component: () => (
    <CatalogNavigation entity="echoes">
      <EchoNew />
      <ActionDock items={echoNewDockActions} />
    </CatalogNavigation>
  ),
})

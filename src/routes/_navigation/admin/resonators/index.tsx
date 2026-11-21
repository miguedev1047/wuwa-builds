import { ActionDock } from "@/components/blocks/action-dock"
import { resonatorListDockActions } from "@/routing/catalog/resonators/list/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { CatalogListRouteSkeleton } from "@catalog/presentation/components/route-skeleton"
import { characterQueries } from "@catalog/queries/characters"
import { ResonatorListScreen } from "@catalog/presentation/resonators/list/resonator-list-screen"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_navigation/admin/resonators/")({
  component: () => (
    <CatalogNavigation entity="resonators">
      <ResonatorListScreen />
      <ActionDock items={resonatorListDockActions} />
    </CatalogNavigation>
  ),
  pendingComponent: () => (
    <CatalogListRouteSkeleton
      title="Resonadores"
      description="Lista de resonadores creados"
      cols={10}
      aspect="portrait"
      count={20}
      actionCount={1}
    />
  ),
  loader: async ({ context }) => {
    await context.queryClient.query(characterQueries.list())
  },
})

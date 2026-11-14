import { CatalogSectionDockActions } from "@/routing/catalog/catalog-dock"
import { sonataDockActions } from "@/routing/catalog/echoes/sonatas/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { CatalogListRouteSkeleton } from "@catalog/presentation/components/route-skeleton"
import { sonataQueries } from "@catalog/queries/sonatas"
import { SonataListScreen } from "@catalog/presentation/sonatas/sonata-list-screen"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/echoes/sonatas")({
  component: () => (
    <CatalogNavigation entity="echoes">
      <SonataListScreen />
      <CatalogSectionDockActions items={sonataDockActions} />
    </CatalogNavigation>
  ),
  pendingComponent: () => (
    <CatalogListRouteSkeleton
      title="Efectos de sonata"
      description="Sets de eco y sus bonos por cantidad de piezas"
      cols={4}
      aspect="portrait"
      count={4}
      actionCount={2}
    />
  ),
  loader: async ({ context }) => {
    await context.queryClient.query(sonataQueries.list())
  },
})

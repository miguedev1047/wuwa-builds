import { CatalogSectionDockActions } from "@/routing/catalog/catalog-dock"
import { echoListDockActions } from "@/routing/catalog/echoes/list/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { CatalogListRouteSkeleton } from "@catalog/presentation/components/route-skeleton"
import { echoQueries } from "@catalog/queries/echoes"
import { EchoListScreen } from "@catalog/presentation/echoes/list/echo-list-screen"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/echoes/")({
  component: () => (
    <CatalogNavigation entity="echoes">
      <EchoListScreen />
      <CatalogSectionDockActions items={echoListDockActions} />
    </CatalogNavigation>
  ),
  pendingComponent: () => (
    <CatalogListRouteSkeleton
      title="Ecos"
      description="Lista de ecos creados"
      cols={6}
      aspect="square"
      count={12}
    />
  ),
  loader: async ({ context }) => {
    await context.queryClient.query(echoQueries.list())
  },
})

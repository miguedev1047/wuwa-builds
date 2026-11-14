import { CatalogSectionDockActions } from "@/routing/catalog/catalog-dock"
import { weaponListDockActions } from "@/routing/catalog/weapons/list/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { CatalogListRouteSkeleton } from "@catalog/presentation/components/route-skeleton"
import { weaponQueries } from "@catalog/queries/weapons"
import { WeaponListScreen } from "@catalog/presentation/weapons/list/weapon-list-screen"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/weapons/")({
  component: () => (
    <CatalogNavigation entity="weapons">
      <WeaponListScreen />
      <CatalogSectionDockActions items={weaponListDockActions} />
    </CatalogNavigation>
  ),
  pendingComponent: () => (
    <CatalogListRouteSkeleton
      title="Armas"
      description="Lista de armas creadas"
      cols={6}
      aspect="square"
      count={12}
    />
  ),
  loader: async ({ context }) => {
    await context.queryClient.query(weaponQueries.list())
  },
})

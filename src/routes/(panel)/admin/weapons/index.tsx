import { CatalogListRouteSkeleton } from "@/modules/panel/admin/game-data/components/route-skeleton"
import { weaponQueries } from "@/modules/panel/admin/game-data/queries/weapons"
import { WeaponListPage } from "@/modules/panel/admin/game-data/views/weapons/list/page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/weapons/")({
  component: () => <WeaponListPage />,
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

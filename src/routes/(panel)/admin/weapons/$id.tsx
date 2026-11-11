import { CatalogDetailRouteSkeleton } from "@panel/admin/game-data/components/route-skeleton"
import { encoreWeaponQueries } from "@encore/queries/catalogs"
import { softPreload } from "@encore/queries/preload"
import { isValidId } from "@game-data/application/id"
import { weaponQueries } from "@game-data/queries/weapons"
import { WeaponDetailPage } from "@panel/admin/game-data/views/weapons/detail/page"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/weapons/$id")({
  component: () => <WeaponDetailPage />,

  pendingComponent: () => <CatalogDetailRouteSkeleton sections={3} />,

  loader: async ({ context, params }) => {
    const id = Number(params.id)

    if (!isValidId(id)) {
      throw notFound()
    }

    const [, weapon] = await Promise.all([
      softPreload(context.queryClient.query(encoreWeaponQueries.detail(id))),
      context.queryClient.query(weaponQueries.detail(id)),
    ])

    if (!weapon) {
      throw notFound()
    }
  },
})

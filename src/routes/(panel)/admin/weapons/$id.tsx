import { catalogResource } from "@/routing/catalog/catalog-resource"
import { CatalogSectionDockActions } from "@/routing/catalog/catalog-dock"
import { weaponDetailDockActions } from "@/routing/catalog/weapons/detail/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { CatalogDetailRouteSkeleton } from "@catalog/presentation/components/route-skeleton"
import { encoreWeaponQueries } from "@encore/queries/catalogs"
import { softPreload } from "@encore/queries/preload"
import { isValidId } from "@catalog/application/id"
import { weaponQueries } from "@catalog/queries/weapons"
import { WeaponDetail } from "@catalog/presentation/weapons/detail/weapon-detail"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/weapons/$id")({
  component: RouteComponent,

  pendingComponent: () => <CatalogDetailRouteSkeleton sections={3} />,

  loader: async ({ context, params }) => {
    const id = Number(params.id)

    if (!isValidId(id)) {
      throw notFound()
    }

    const [, weapon] = await Promise.all([
      softPreload(context.queryClient.query(encoreWeaponQueries.detail(id))),
      catalogResource(context.queryClient.query(weaponQueries.detail(id))),
    ])

    if (!weapon) {
      throw notFound()
    }
  },
})

/** Binds route parameters to the catalog detail screen. */
function RouteComponent() {
  return (
    <CatalogNavigation entity="weapons">
      <WeaponDetail weaponId={Number(Route.useParams().id)} />
      <CatalogSectionDockActions items={weaponDetailDockActions} />
    </CatalogNavigation>
  )
}

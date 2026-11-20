import { catalogResource } from "@/routing/catalog/catalog-resource"
import { ActionDock } from "@/components/blocks/action-dock"
import { resonatorDetailDockActions } from "@/routing/catalog/resonators/detail/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { CatalogDetailRouteSkeleton } from "@catalog/presentation/components/route-skeleton"
import { encoreCharacterQueries } from "@encore/queries/characters"
import { softPreload } from "@encore/queries/preload"
import { characterQueries } from "@catalog/queries/characters"
import { sonataQueries } from "@catalog/queries/sonatas"
import { weaponQueries } from "@catalog/queries/weapons"
import { ResonatorDetail } from "@catalog/presentation/resonators/detail/resonator-detail"
import { createFileRoute, notFound } from "@tanstack/react-router"
import { isValidId } from "@/modules/catalog/application/id"

export const Route = createFileRoute("/_navigation/admin/resonators/$id")({
  component: RouteComponent,

  pendingComponent: () => <CatalogDetailRouteSkeleton sections={8} />,

  loader: async ({ context, params }) => {
    const id = Number(params.id)

    if (!isValidId(id)) {
      throw notFound()
    }

    const [, resonator] = await Promise.all([
      softPreload(context.queryClient.query(encoreCharacterQueries.detail(id))),
      catalogResource(context.queryClient.query(characterQueries.detail(id))),
      context.queryClient.query(weaponQueries.list()),
      context.queryClient.query(sonataQueries.list()),
    ])

    if (!resonator) {
      throw notFound()
    }
  },
})

/** Binds route parameters to the catalog detail screen. */
function RouteComponent() {
  return (
    <CatalogNavigation entity="resonators">
      <ResonatorDetail resonatorId={Number(Route.useParams().id)} />
      <ActionDock items={resonatorDetailDockActions} />
    </CatalogNavigation>
  )
}

import { catalogResource } from "@/routing/catalog/catalog-resource"
import { CatalogSectionDockActions } from "@/routing/catalog/catalog-dock"
import { resonatorDetailDockActions } from "@/routing/catalog/resonators/detail/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { CatalogDetailRouteSkeleton } from "@catalog/presentation/components/route-skeleton"
import { encoreCharacterQueries } from "@encore/queries/characters"
import { softPreload } from "@encore/queries/preload"
import { characterQueries } from "@catalog/queries/characters"
import { ResonatorDetail } from "@catalog/presentation/resonators/detail/resonator-detail"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/resonators/$id")({
  component: RouteComponent,

  pendingComponent: () => <CatalogDetailRouteSkeleton sections={6} />,

  loader: async ({ context, params }) => {
    const id = Number(params.id)

    const [, resonator] = await Promise.all([
      softPreload(context.queryClient.query(encoreCharacterQueries.detail(id))),
      catalogResource(context.queryClient.query(characterQueries.detail(id))),
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
      <CatalogSectionDockActions items={resonatorDetailDockActions} />
    </CatalogNavigation>
  )
}

import { catalogResource } from "@/routing/catalog/catalog-resource"
import { CatalogSectionDockActions } from "@/routing/catalog/catalog-dock"
import { echoDetailDockActions } from "@/routing/catalog/echoes/detail/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { CatalogDetailRouteSkeleton } from "@catalog/presentation/components/route-skeleton"
import { encoreEchoQueries } from "@encore/queries/catalogs"
import { softPreload } from "@encore/queries/preload"
import { isValidId } from "@catalog/application/id"
import { echoQueries } from "@catalog/queries/echoes"
import { EchoDetail } from "@catalog/presentation/echoes/detail/echo-detail"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/echoes/$id")({
  component: RouteComponent,

  pendingComponent: () => <CatalogDetailRouteSkeleton sections={2} />,

  loader: async ({ context, params }) => {
    const id = Number(params.id)

    if (!isValidId(id)) {
      throw notFound()
    }

    const [, echo] = await Promise.all([
      softPreload(context.queryClient.query(encoreEchoQueries.detail(id))),
      catalogResource(context.queryClient.query(echoQueries.detail(id))),
    ])

    if (!echo) {
      throw notFound()
    }
  },
})

/** Binds route parameters to the catalog detail screen. */
function RouteComponent() {
  return (
    <CatalogNavigation entity="echoes">
      <EchoDetail echoId={Number(Route.useParams().id)} />
      <CatalogSectionDockActions items={echoDetailDockActions} />
    </CatalogNavigation>
  )
}

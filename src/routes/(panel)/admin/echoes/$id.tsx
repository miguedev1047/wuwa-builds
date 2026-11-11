import { CatalogDetailRouteSkeleton } from "@panel/admin/game-data/components/route-skeleton"
import { encoreEchoQueries } from "@encore/queries/catalogs"
import { softPreload } from "@encore/queries/preload"
import { isValidId } from "@game-data/application/id"
import { echoQueries } from "@game-data/queries/echoes"
import { EchoDetailPage } from "@panel/admin/game-data/views/echoes/detail/page"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/echoes/$id")({
  component: () => <EchoDetailPage />,

  pendingComponent: () => <CatalogDetailRouteSkeleton sections={2} />,

  loader: async ({ context, params }) => {
    const id = Number(params.id)

    if (!isValidId(id)) {
      throw notFound()
    }

    const [, echo] = await Promise.all([
      softPreload(context.queryClient.query(encoreEchoQueries.detail(id))),
      context.queryClient.query(echoQueries.detail(id)),
    ])

    if (!echo) {
      throw notFound()
    }
  },
})

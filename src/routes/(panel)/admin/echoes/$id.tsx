import { CatalogDetailRouteSkeleton } from "@/modules/panel/admin/game-data/components/route-skeleton"
import { encoreEchoQueries } from "@/modules/encore/queries/catalogs"
import { isValidId } from "@/modules/game-data/application/id"
import { echoQueries } from "@/modules/game-data/queries/echoes"
import { EchoDetailPage } from "@/modules/panel/admin/game-data/views/echoes/detail/page"
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
      context.queryClient.query(encoreEchoQueries.detail(id)),
      context.queryClient.query(echoQueries.detail(id)),
    ])

    if (!echo) {
      throw notFound()
    }
  },
})

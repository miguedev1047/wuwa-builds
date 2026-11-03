import { Spinner } from "@/components/ui/spinner"
import { isValidId } from "@/modules/panel/admin/game-data/application/id"
import { echoQueries } from "@/modules/panel/admin/game-data/queries/echoes"
import { EchoDetailPage } from "@/modules/panel/admin/game-data/views/echoes/detail/page"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/echoes/$id")({
  component: () => <EchoDetailPage />,

  pendingComponent: () => <Spinner />,
  errorComponent: () => <Spinner />,
  notFoundComponent: () => <Spinner />,

  loader: async ({ context, params }) => {
    const id = Number(params.id)

    if (!isValidId(id)) {
      throw notFound()
    }

    const echo = await context.queryClient.query(echoQueries.detail(id))

    if (!echo) {
      throw notFound()
    }
  },
})

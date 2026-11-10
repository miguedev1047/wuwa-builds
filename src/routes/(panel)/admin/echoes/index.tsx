import { CatalogListRouteSkeleton } from "@panel/admin/game-data/components/route-skeleton"
import { echoQueries } from "@game-data/queries/echoes"
import { EchoListPage } from "@panel/admin/game-data/views/echoes/list/page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/echoes/")({
  component: () => <EchoListPage />,
  pendingComponent: () => (
    <CatalogListRouteSkeleton
      title="Ecos"
      description="Lista de ecos creados"
      cols={6}
      aspect="square"
      count={12}
    />
  ),
  loader: async ({ context }) => {
    await context.queryClient.query(echoQueries.list())
  },
})

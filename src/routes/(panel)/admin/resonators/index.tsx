import { CatalogListRouteSkeleton } from "@/modules/panel/admin/game-data/components/route-skeleton"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorListPage } from "@/modules/panel/admin/game-data/views/resonators/list/page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/resonators/")({
  component: () => <ResonatorListPage />,
  pendingComponent: () => (
    <CatalogListRouteSkeleton
      title="Resonadores"
      description="Lista de resonadores creados"
      cols={10}
      aspect="portrait"
      count={20}
    />
  ),
  loader: async ({ context }) => {
    await context.queryClient.query(characterQueries.list())
  },
})

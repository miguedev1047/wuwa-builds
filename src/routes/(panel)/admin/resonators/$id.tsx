import { Spinner } from "@/components/ui/spinner"
import { characterQueries as encoreCharacterQueries } from "@/modules/encore/queries/characters"
import { characterQueries as wuwaBuildsCharacterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorDetailPage } from "@/modules/panel/admin/game-data/views/resonators/detail/page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/resonators/$id")({
  component: () => <ResonatorDetailPage />,

  pendingComponent: () => <Spinner />,
  errorComponent: () => <Spinner />,
  notFoundComponent: () => <Spinner />,

  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.query(
        encoreCharacterQueries.detail(parseInt(params.id))
      ),
      context.queryClient.query(
        wuwaBuildsCharacterQueries.detail(parseInt(params.id))
      ),
    ])
  },
})

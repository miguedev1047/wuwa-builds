import { Spinner } from "@/components/ui/spinner"
import { characterQueries as encoreCharacterQueries } from "@/modules/encore/queries/characters"
import { characterQueries as wuwaBuildsCharacterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorIdPage } from "@/modules/panel/admin/game-data/views/resonators/pages/id-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/resonators/$id")({
  component: () => <ResonatorIdPage />,

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

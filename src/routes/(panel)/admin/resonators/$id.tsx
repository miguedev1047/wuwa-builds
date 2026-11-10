import { CatalogDetailRouteSkeleton } from "@panel/admin/game-data/components/route-skeleton"
import { encoreCharacterQueries } from "@encore/queries/characters"
import { characterQueries } from "@game-data/queries/characters"
import { ResonatorDetailPage } from "@panel/admin/game-data/views/resonators/detail/page"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/resonators/$id")({
  component: () => <ResonatorDetailPage />,

  pendingComponent: () => <CatalogDetailRouteSkeleton sections={6} />,

  loader: async ({ context, params }) => {
    const id = Number(params.id)

    const [, resonator] = await Promise.all([
      context.queryClient.query(encoreCharacterQueries.detail(id)),
      context.queryClient.query(characterQueries.detail(id)),
    ])

    if (!resonator) {
      throw notFound()
    }
  },
})

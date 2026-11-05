import { CatalogListRouteSkeleton } from "@/modules/panel/admin/game-data/components/route-skeleton"
import { sonataQueries } from "@/modules/game-data/queries/sonatas"
import { SonataListPage } from "@/modules/panel/admin/game-data/views/echoes/sonatas/page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/echoes/sonatas")({
  component: () => <SonataListPage />,
  pendingComponent: () => (
    <CatalogListRouteSkeleton
      title="Efectos de sonata"
      description="Sets de eco y sus bonos por cantidad de piezas"
      cols={4}
      aspect="portrait"
      count={4}
      actionCount={2}
    />
  ),
  loader: async ({ context }) => {
    await context.queryClient.query(sonataQueries.list())
  },
})

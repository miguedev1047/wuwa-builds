import { Spinner } from "@/components/ui/spinner"
import { sonataQueries } from "@/modules/panel/admin/game-data/queries/sonatas"
import { SonataListPage } from "@/modules/panel/admin/game-data/views/echoes/sonatas/page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/echoes/sonatas")({
  component: () => <SonataListPage />,
  pendingComponent: () => <Spinner />,
  errorComponent: () => <Spinner />,
  loader: async ({ context }) => {
    await context.queryClient.query(sonataQueries.list())
  },
})

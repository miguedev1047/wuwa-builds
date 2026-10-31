import { Spinner } from "@/components/ui/spinner"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorListPage } from "@/modules/panel/admin/game-data/views/resonators/pages/list-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/resonators/")({
  component: () => <ResonatorListPage />,
  pendingComponent: () => (
    <div className="grid place-content-center">
      <div className="flex items-center gap-1">
        <h2>Cargando</h2>
        <Spinner />
      </div>
    </div>
  ),
  errorComponent: () => (
    <div className="grid place-content-center">
      <div className="space-y-2">
        <p>Error al mostrar contenido de esta pagina</p>
      </div>
    </div>
  ),
  loader: async ({ context }) => {
    await context.queryClient.query(characterQueries.list())
  },
})

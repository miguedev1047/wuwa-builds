import { Spinner } from "@/components/ui/spinner"
import { echoQueries } from "@/modules/panel/admin/game-data/queries/echoes"
import { EchoListPage } from "@/modules/panel/admin/game-data/views/echoes/pages/list-page"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/echoes")({
  component: () => <EchoListPage />,
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
    await context.queryClient.query(echoQueries.list())
  },
})

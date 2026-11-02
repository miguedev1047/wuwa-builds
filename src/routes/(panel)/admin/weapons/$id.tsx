import { Spinner } from "@/components/ui/spinner"
import { isValidId } from "@/modules/panel/admin/game-data/application/id"
import { weaponQueries } from "@/modules/panel/admin/game-data/queries/weapons"
import { WeaponDetailPage } from "@/modules/panel/admin/game-data/views/weapons/detail/page"
import { createFileRoute, notFound } from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/admin/weapons/$id")({
  component: () => <WeaponDetailPage />,

  pendingComponent: () => <Spinner />,
  errorComponent: () => <Spinner />,
  notFoundComponent: () => <Spinner />,

  loader: async ({ context, params }) => {
    const id = Number(params.id)

    if (!isValidId(id)) {
      throw notFound()
    }

    const weapon = await context.queryClient.query(weaponQueries.detail(id))

    if (!weapon) {
      throw notFound()
    }
  },
})

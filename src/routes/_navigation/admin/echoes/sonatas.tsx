import { ActionDock } from "@/components/blocks/action-dock"
import { sonataDockActions } from "@/routing/catalog/echoes/sonatas/dock-actions"
import { CatalogNavigation } from "@/routing/catalog/catalog-navigation"
import { CatalogListRouteSkeleton } from "@catalog/presentation/components/route-skeleton"
import { sonataQueries } from "@catalog/queries/sonatas"
import { SonataListScreen } from "@catalog/presentation/sonatas/sonata-list-screen"
import { sonataAnchorId } from "@catalog/presentation/sonatas/sonata-anchor"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_navigation/admin/echoes/sonatas")({
  component: SonataListRoute,
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

/** Binds sonata selection to fragment navigation on the list route. */
function SonataListRoute() {
  const navigate = Route.useNavigate()

  return (
    <CatalogNavigation entity="echoes">
      <SonataListScreen
        onSelectSonata={(id) =>
          navigate({ to: ".", search: true, hash: sonataAnchorId(id) })
        }
      />
      <ActionDock items={sonataDockActions} />
    </CatalogNavigation>
  )
}

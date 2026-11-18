import { RouteNavigation } from "@/components/blocks/route-navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { SonataAddAction } from "@catalog/presentation/sonatas/components/sonata-add-action"
import { SonataList } from "@catalog/presentation/sonatas/components/sonata-list"
import { SonataSyncAction } from "@catalog/presentation/sonatas/components/sonata-sync-action"
import { Suspense } from "react"

export function SonataListScreen() {
  return (
    <RouteNavigation.Root>
      <RouteNavigation.Header>
        <RouteNavigation.Title>Efectos de sonata</RouteNavigation.Title>
        <RouteNavigation.Description>
          Sets de eco y sus bonos por cantidad de piezas
        </RouteNavigation.Description>

        <RouteNavigation.Actions>
          <SonataSyncAction />
          <SonataAddAction />
        </RouteNavigation.Actions>
      </RouteNavigation.Header>

      <RouteNavigation.Content>
        <Suspense
          fallback={
            <div role="status" aria-live="polite" className="space-y-2">
              <span className="sr-only">Cargando efectos de sonata</span>
              {Array.from({ length: 3 }, (_, index) => (
                <Skeleton key={index} className="h-32 w-full rounded-lg" />
              ))}
            </div>
          }
        >
          <SonataList />
        </Suspense>
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}

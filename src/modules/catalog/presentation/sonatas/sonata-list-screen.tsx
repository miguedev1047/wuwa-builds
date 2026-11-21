import { RouteNavigation } from "@/components/blocks/route-navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { SonataList } from "@catalog/presentation/sonatas/components/sonata-list"
import { SonataListActions } from "@catalog/presentation/sonatas/components/sonata-list-actions"
import { SonataCatalogSearch } from "@catalog/presentation/sonatas/components/sonata-catalog-search"
import { Suspense } from "react"

type SonataListScreenProps = {
  /** Scrolls to the selected sonata on this page. */
  onSelectSonata: (id: number) => void | Promise<void>
}

/** Admin list of sonatas and its search and management actions. */
export function SonataListScreen({ onSelectSonata }: SonataListScreenProps) {
  return (
    <RouteNavigation.Root data-sonata-list="">
      <RouteNavigation.Header>
        <RouteNavigation.Title>Efectos de sonata</RouteNavigation.Title>
        <RouteNavigation.Description>
          Sets de eco y sus bonos por cantidad de piezas
        </RouteNavigation.Description>

        <RouteNavigation.Actions>
          <SonataCatalogSearch onSelect={onSelectSonata} />
          <SonataListActions />
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

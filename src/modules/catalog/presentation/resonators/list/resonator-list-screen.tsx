import { RouteNavigation } from "@/components/blocks/route-navigation"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { ResonatorCatalogSearch } from "@catalog/presentation/resonators/list/components/resonator-catalog-search"
import { ResonatorList } from "@catalog/presentation/resonators/list/components/resonator-list"
import { Suspense } from "react"

export function ResonatorListScreen() {
  const { onOpenDetail } = useCatalogActions()

  return (
    <RouteNavigation.Root>
      <RouteNavigation.Header>
        <RouteNavigation.Title>Resonadores</RouteNavigation.Title>
        <RouteNavigation.Description>
          Lista de resonadores creados
        </RouteNavigation.Description>
        <RouteNavigation.Actions>
          <ResonatorCatalogSearch onSelect={onOpenDetail} />
        </RouteNavigation.Actions>
      </RouteNavigation.Header>

      <RouteNavigation.Content>
        <Suspense
          fallback={
            <RouteNavigation.Loading
              cols={6}
              aspect="portrait"
              count={20}
              label="Cargando resonadores"
            />
          }
        >
          <ResonatorList />
        </Suspense>
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}

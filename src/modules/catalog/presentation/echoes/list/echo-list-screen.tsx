import { RouteNavigation } from "@/components/blocks/route-navigation"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { EchoCatalogSearch } from "@catalog/presentation/echoes/list/components/echo-catalog-search"
import { EchoList } from "@catalog/presentation/echoes/list/components/echo-list"
import { Suspense } from "react"

export function EchoListScreen() {
  const { onOpenDetail } = useCatalogActions()

  return (
    <RouteNavigation.Root>
      <RouteNavigation.Header>
        <RouteNavigation.Title>Ecos</RouteNavigation.Title>
        <RouteNavigation.Description>
          Lista de ecos creados
        </RouteNavigation.Description>
        <RouteNavigation.Actions>
          <EchoCatalogSearch onSelect={onOpenDetail} />
        </RouteNavigation.Actions>
      </RouteNavigation.Header>

      <RouteNavigation.Content>
        <Suspense
          fallback={
            <RouteNavigation.Loading
              cols={6}
              aspect="square"
              count={12}
              label="Cargando ecos"
            />
          }
        >
          <EchoList />
        </Suspense>
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}

import { RouteNavigation } from "@/components/blocks/route-navigation"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { WeaponCatalogSearch } from "@catalog/presentation/weapons/list/components/weapon-catalog-search"
import { WeaponList } from "@catalog/presentation/weapons/list/components/weapon-list"
import { Suspense } from "react"

export function WeaponListScreen() {
  const { onOpenDetail } = useCatalogActions()

  return (
    <RouteNavigation.Root>
      <RouteNavigation.Header>
        <RouteNavigation.Title>Armas</RouteNavigation.Title>
        <RouteNavigation.Description>
          Lista de armas creadas
        </RouteNavigation.Description>
        <RouteNavigation.Actions>
          <WeaponCatalogSearch onSelect={onOpenDetail} />
        </RouteNavigation.Actions>
      </RouteNavigation.Header>

      <RouteNavigation.Content>
        <Suspense
          fallback={
            <RouteNavigation.Loading
              cols={6}
              aspect="square"
              count={12}
              label="Cargando armas"
            />
          }
        >
          <WeaponList />
        </Suspense>
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}

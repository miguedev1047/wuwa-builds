import { RouteNavigation } from "@/components/blocks/route-navigation"
import { WeaponList } from "@catalog/presentation/weapons/list/components/weapon-list"
import { Suspense } from "react"

export function WeaponListScreen() {
  return (
    <RouteNavigation.Root>
      <RouteNavigation.Header>
        <RouteNavigation.Title>Armas</RouteNavigation.Title>
        <RouteNavigation.Description>
          Lista de armas creadas
        </RouteNavigation.Description>
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

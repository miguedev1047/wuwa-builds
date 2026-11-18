import { RouteNavigation } from "@/components/blocks/route-navigation"
import { EchoList } from "@catalog/presentation/echoes/list/components/echo-list"
import { Suspense } from "react"

export function EchoListScreen() {
  return (
    <RouteNavigation.Root>
      <RouteNavigation.Header>
        <RouteNavigation.Title>Ecos</RouteNavigation.Title>
        <RouteNavigation.Description>
          Lista de ecos creados
        </RouteNavigation.Description>
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

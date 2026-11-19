import { RouteNavigation } from "@/components/blocks/route-navigation"
import { ResonatorList } from "@catalog/presentation/resonators/list/components/resonator-list"
import { Suspense } from "react"

export function ResonatorListScreen() {
  return (
    <RouteNavigation.Root>
      <RouteNavigation.Header>
        <RouteNavigation.Title>Resonadores</RouteNavigation.Title>
        <RouteNavigation.Description>
          Lista de resonadores creados
        </RouteNavigation.Description>
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

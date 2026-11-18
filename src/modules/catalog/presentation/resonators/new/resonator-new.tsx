import { RouteNavigation } from "@/components/blocks/route-navigation"
import { ResonatorForm } from "@catalog/presentation/resonators/shared/components/resonator-form"

export function ResonatorNew() {
  return (
    <RouteNavigation.Root>
      <RouteNavigation.Header>
        <RouteNavigation.Title>Nuevo resonador</RouteNavigation.Title>
      </RouteNavigation.Header>

      <RouteNavigation.Content>
        <ResonatorForm />
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}

import { RouteNavigation } from "@/components/blocks/route-navigation"
import { EchoForm } from "@catalog/presentation/echoes/new/components/echo-form"

export function EchoNew() {
  return (
    <RouteNavigation.Root>
      <RouteNavigation.Header>
        <RouteNavigation.Title>Nuevo eco</RouteNavigation.Title>
        <RouteNavigation.Description>
          Crea un eco en el catálogo o préllenalo desde Encore
        </RouteNavigation.Description>
      </RouteNavigation.Header>

      <RouteNavigation.Content>
        <EchoForm />
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}

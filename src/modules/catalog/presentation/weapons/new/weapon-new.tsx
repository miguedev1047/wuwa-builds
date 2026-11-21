import { RouteNavigation } from "@/components/blocks/route-navigation"
import { WeaponForm } from "@catalog/presentation/weapons/new/components/weapon-form"

export function WeaponNew() {
  return (
    <RouteNavigation.Root>
      <RouteNavigation.Header>
        <RouteNavigation.Title>Nueva arma</RouteNavigation.Title>
        <RouteNavigation.Description>
          Crea un arma en el catálogo o préllenala desde Encore
        </RouteNavigation.Description>
      </RouteNavigation.Header>

      <RouteNavigation.Content>
        <WeaponForm />
      </RouteNavigation.Content>
    </RouteNavigation.Root>
  )
}

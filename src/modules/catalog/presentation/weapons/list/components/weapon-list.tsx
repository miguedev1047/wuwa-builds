import { RouteNavigation } from "@/components/blocks/route-navigation"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { weaponQueries } from "@catalog/queries/weapons"
import { WeaponListItem } from "@catalog/presentation/weapons/list/components/weapon-list-item"

export function WeaponList() {
  const { createLink } = useCatalogActions()
  const { data: weapons } = useSuspenseQuery(weaponQueries.list())

  return (
    <RouteNavigation.List
      items={weapons}
      cols={6}
      aspect="square"
      getKey={(weapon) => weapon.id}
      empty={
        <CatalogSection.Empty
          title="Sin datos"
          description="Sin armas disponibles en esta seccion"
          action={createLink}
        />
      }
    >
      {(weapon) => <WeaponListItem weapon={weapon} />}
    </RouteNavigation.List>
  )
}

import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { weaponQueries } from "@catalog/queries/weapons"
import { WeaponItem } from "@catalog/presentation/weapons/list/components/weapon-item"

export function WeaponList() {
  const { createLink } = useCatalogActions()
  const { data: weapons } = useSuspenseQuery(weaponQueries.list())

  return (
    <CatalogSection.List
      items={weapons}
      cols={6}
      aspect="square"
      getItemKey={(weapon) => weapon.id}
      empty={
        <CatalogSection.Empty
          title="Sin datos"
          description="Sin armas disponibles en esta seccion"
          action={createLink}
        />
      }
    >
      {(weapon) => <WeaponItem weapon={weapon} />}
    </CatalogSection.List>
  )
}

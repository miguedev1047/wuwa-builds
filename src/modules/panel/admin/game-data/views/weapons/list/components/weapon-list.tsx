import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { weaponQueries } from "@game-data/queries/weapons"
import { WeaponItem } from "@panel/admin/game-data/views/weapons/list/components/weapon-item"

export function WeaponList() {
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
          action={{
            label: "Agregar arma",
            linkOptions: { to: "/admin/weapons/new" },
          }}
        />
      }
    >
      {(weapon) => <WeaponItem weapon={weapon} />}
    </CatalogSection.List>
  )
}

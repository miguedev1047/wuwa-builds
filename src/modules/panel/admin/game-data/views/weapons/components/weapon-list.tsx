import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { weaponQueries } from "@/modules/panel/admin/game-data/queries/weapons"
import { WeaponItem } from "@/modules/panel/admin/game-data/views/weapons/components/weapon-item"

export function WeaponList() {
  const { data: weapons } = useSuspenseQuery(weaponQueries.list())

  return (
    <CatalogSection.List
      items={weapons}
      cols={6}
      getItemKey={(weapon) => weapon.id}
      empty={
        <CatalogSection.Empty
          title="Sin datos"
          description="Sin armas disponibles en esta seccion"
          action={{
            label: "Agregar arma",
            linkOptions: { to: "/admin/weapons" },
          }}
        />
      }
    >
      {(weapon) => <WeaponItem weapon={weapon} />}
    </CatalogSection.List>
  )
}

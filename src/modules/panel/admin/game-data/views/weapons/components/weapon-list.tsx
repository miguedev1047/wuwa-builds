import { useQuery } from "@tanstack/react-query"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { weaponQueries } from "@/modules/panel/admin/game-data/queries/weapons"
import { WeaponItem } from "@/modules/panel/admin/game-data/views/weapons/components/weapon-item"
import { Skeleton } from "skullet/react"

export function WeaponList() {
  const { data } = useQuery(weaponQueries.list())

  return (
    <Skeleton
      data={data}
      label="Cargando armas"
      skeleton={<CatalogSection.Loading cols={6} aspect="square" count={12} />}
    >
      {(weapons) => (
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
                linkOptions: { to: "/admin/weapons" },
              }}
            />
          }
        >
          {(weapon) => <WeaponItem weapon={weapon} />}
        </CatalogSection.List>
      )}
    </Skeleton>
  )
}

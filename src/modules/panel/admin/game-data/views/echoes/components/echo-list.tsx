import { useQuery } from "@tanstack/react-query"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { echoQueries } from "@/modules/panel/admin/game-data/queries/echoes"
import { EchoItem } from "@/modules/panel/admin/game-data/views/echoes/components/echo-item"
import { Skeleton } from "skullet/react"

export function EchoList() {
  const { data } = useQuery(echoQueries.list())

  return (
    <Skeleton
      data={data}
      label="Cargando armas"
      skeleton={<CatalogSection.Loading cols={6} aspect="square" count={12} />}
    >
      {(echoes) => (
        <CatalogSection.List
          items={echoes}
          cols={6}
          aspect="square"
          getItemKey={(echo) => echo.id}
          empty={
            <CatalogSection.Empty
              title="Sin datos"
              description="Sin ecos disponibles en esta seccion"
              action={{
                label: "Agregar eco",
                linkOptions: { to: "/admin/echoes" },
              }}
            />
          }
        >
          {(echo) => <EchoItem echo={echo} />}
        </CatalogSection.List>
      )}
    </Skeleton>
  )
}

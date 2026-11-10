import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { echoQueries } from "@game-data/queries/echoes"
import { EchoItem } from "@panel/admin/game-data/views/echoes/list/components/echo-item"

export function EchoList() {
  const { data: echoes } = useSuspenseQuery(echoQueries.list())

  return (
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
            linkOptions: { to: "/admin/echoes/new" },
          }}
        />
      }
    >
      {(echo) => <EchoItem echo={echo} />}
    </CatalogSection.List>
  )
}

import { RouteNavigation } from "@/components/blocks/route-navigation"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { echoQueries } from "@catalog/queries/echoes"
import { EchoItem } from "@catalog/presentation/echoes/list/components/echo-item"

export function EchoList() {
  const { createLink } = useCatalogActions()
  const { data: echoes } = useSuspenseQuery(echoQueries.list())

  return (
    <RouteNavigation.List
      items={echoes}
      cols={6}
      aspect="square"
      getKey={(echo) => echo.id}
      empty={
        <CatalogSection.Empty
          title="Sin datos"
          description="Sin ecos disponibles en esta seccion"
          action={createLink}
        />
      }
    >
      {(echo) => <EchoItem echo={echo} />}
    </RouteNavigation.List>
  )
}

import { RouteNavigation } from "@/components/blocks/route-navigation"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { characterQueries } from "@catalog/queries/characters"
import { ResonatorListItem } from "@catalog/presentation/resonators/list/components/resonator-list-item"

export function ResonatorList() {
  const { createLink } = useCatalogActions()
  const { data: characters } = useSuspenseQuery(characterQueries.list())

  return (
    <RouteNavigation.List
      items={characters}
      cols={8}
      aspect="portrait"
      getKey={(character) => character.id}
      empty={
        <CatalogSection.Empty
          title="Sin datos"
          description="Sin resonadores disponibles en esta seccion"
          action={createLink}
        />
      }
    >
      {(character) => <ResonatorListItem character={character} />}
    </RouteNavigation.List>
  )
}

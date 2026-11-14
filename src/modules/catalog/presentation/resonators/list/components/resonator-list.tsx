import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { characterQueries } from "@catalog/queries/characters"
import { ResonatorItem } from "@catalog/presentation/resonators/list/components/resonator-item"

export function ResonatorList() {
  const { createLink } = useCatalogActions()
  const { data: characters } = useSuspenseQuery(characterQueries.list())

  return (
    <CatalogSection.List
      items={characters}
      cols={8}
      aspect="portrait"
      getItemKey={(character) => character.id}
      empty={
        <CatalogSection.Empty
          title="Sin datos"
          description="Sin resonadores disponibles en esta seccion"
          action={createLink}
        />
      }
    >
      {(character) => <ResonatorItem character={character} />}
    </CatalogSection.List>
  )
}

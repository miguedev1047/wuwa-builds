import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { characterQueries } from "@game-data/queries/characters"
import { ResonatorItem } from "@panel/admin/game-data/views/resonators/list/components/resonator-item"

export function ResonatorList() {
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
          action={{
            label: "Agregar resonador",
            linkOptions: { to: "/admin/resonators/new" },
          }}
        />
      }
    >
      {(character) => <ResonatorItem character={character} />}
    </CatalogSection.List>
  )
}

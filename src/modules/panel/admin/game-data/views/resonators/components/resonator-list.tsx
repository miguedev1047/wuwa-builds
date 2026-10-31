import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorItem } from "@/modules/panel/admin/game-data/views/resonators/components/resonator-item"

export function ResonatorList() {
  const { data: characters } = useSuspenseQuery(characterQueries.list())

  return (
    <CatalogSection.List
      items={characters}
      cols={10}
      getItemKey={(character) => character.id}
      empty={
        <CatalogSection.Empty
          title="Sin datos"
          description="Sin resonadores disponibles en esta seccion"
          action={{
            label: "Agregar resonador",
            linkOptions: { to: "/admin/resonators" },
          }}
        />
      }
    >
      {(character) => <ResonatorItem character={character} />}
    </CatalogSection.List>
  )
}

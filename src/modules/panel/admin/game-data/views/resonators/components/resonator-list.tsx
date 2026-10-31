import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "skullet/react"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorItem } from "@/modules/panel/admin/game-data/views/resonators/components/resonator-item"

export function ResonatorList() {
  const { data } = useQuery(characterQueries.list())

  return (
    <Skeleton
      data={data}
      label="Cargando resonadores"
      skeleton={
        <CatalogSection.Loading cols={10} aspect="portrait" count={20} />
      }
    >
      {(characters) => (
        <CatalogSection.List
          items={characters}
          cols={10}
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
      )}
    </Skeleton>
  )
}

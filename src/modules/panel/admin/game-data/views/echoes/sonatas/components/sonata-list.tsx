import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "skullet/react"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { sonataQueries } from "@/modules/panel/admin/game-data/queries/sonatas"
import { SonataCard } from "@/modules/panel/admin/game-data/views/echoes/sonatas/components/sonata-card"

export function SonataList() {
  const { data } = useQuery(sonataQueries.list())

  return (
    <Skeleton
      data={data}
      label="Cargando efectos de sonata"
      skeleton={<CatalogSection.Loading cols={4} aspect="portrait" count={4} />}
    >
      {(sonatas) => (
        <EditableSection.List
          items={sonatas}
          getItemKey={(sonata) => sonata.id}
          empty={
            <CatalogSection.Empty
              title="Sin efectos de sonata"
              description="Sincroniza con Encore o agrega un set manual."
            />
          }
        >
          {(sonata) => <SonataCard sonata={sonata} />}
        </EditableSection.List>
      )}
    </Skeleton>
  )
}

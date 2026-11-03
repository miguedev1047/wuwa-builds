import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { sonataQueries } from "@/modules/panel/admin/game-data/queries/sonatas"
import { SonataCard } from "@/modules/panel/admin/game-data/views/echoes/sonatas/components/sonata-card"

export function SonataList() {
  const { data: sonatas } = useSuspenseQuery(sonataQueries.list())

  return (
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
  )
}

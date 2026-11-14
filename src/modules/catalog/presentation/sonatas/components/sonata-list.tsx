import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { sonataQueries } from "@catalog/queries/sonatas"
import { SonataCard } from "@catalog/presentation/sonatas/components/sonata-card"

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

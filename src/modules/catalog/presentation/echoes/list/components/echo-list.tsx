import { useCatalogActions } from "@catalog/presentation/catalog-actions"
import { useSuspenseQuery } from "@tanstack/react-query"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { echoQueries } from "@catalog/queries/echoes"
import { sonataQueries } from "@catalog/queries/sonatas"
import { groupEchoesBySonata } from "@catalog/presentation/echoes/list/application/group-echoes-by-sonata"
import { EchoSonataGroupSection } from "@catalog/presentation/echoes/list/components/echo-sonata-group"

/** Admin echo list, grouped by the sonata set each echo can drop from. */
export function EchoList() {
  const { createLink } = useCatalogActions()
  const { data: echoes } = useSuspenseQuery(echoQueries.selection())
  const { data: sonatas } = useSuspenseQuery(sonataQueries.list())
  const groups = groupEchoesBySonata(echoes, sonatas)

  if (groups.length === 0) {
    return (
      <CatalogSection.Empty
        title="Sin datos"
        description="Sin ecos disponibles en esta seccion"
        action={createLink}
      />
    )
  }

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <EchoSonataGroupSection
          key={group.setId ?? "sin-sonata"}
          group={group}
        />
      ))}
    </div>
  )
}

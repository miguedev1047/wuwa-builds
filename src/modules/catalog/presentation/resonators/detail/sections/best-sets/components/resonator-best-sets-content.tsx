import { Badge } from "@/components/panelui/badge"
import { Show } from "@/components/utility/show"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { characterQueries } from "@catalog/queries/characters"
import { useSuspenseQuery } from "@tanstack/react-query"

type ResonatorBestSetsContentProps = {
  resonatorId: number
}

/** Ranked Sonata set recommendations using joined catalog data. */
export function ResonatorBestSetsContent({
  resonatorId,
}: ResonatorBestSetsContentProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  return (
    <EditableSection.Content>
      <EditableSection.List
        items={resonator.bestSets}
        getItemKey={(bestSet) => bestSet.id}
        empty={
          <EditableSection.Text>
            Sin sets de Sonata recomendados.
          </EditableSection.Text>
        }
      >
        {(bestSet, index) => (
          <EditableSection.Item>
            <EditableSection.Media variant="image">
              <Show when={bestSet.sonata?.icon}>
                {(icon) => <EditableSection.Image src={icon} alt="" />}
              </Show>
            </EditableSection.Media>
            <EditableSection.ItemContent>
              <EditableSection.ItemTitle>
                <Show
                  when={bestSet.sonata}
                  fallback="Set no disponible en el catálogo"
                >
                  {(sonata) => sonata.name}
                </Show>
              </EditableSection.ItemTitle>
              <EditableSection.ItemDescription>
                Prioridad {bestSet.sortOrder}
              </EditableSection.ItemDescription>
            </EditableSection.ItemContent>
            <Show when={index === 0}>
              <Badge variant="secondary">Mejor set</Badge>
            </Show>
          </EditableSection.Item>
        )}
      </EditableSection.List>
    </EditableSection.Content>
  )
}

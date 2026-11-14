import type { ResonatorPropertyGrowthRow } from "@db/schema"
import { formatGrowthValue } from "@catalog/application/resonators/property-growth"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { PropertyGrowthDeleteAction } from "@catalog/presentation/resonators/detail/sections/levels/components/property-growth-delete-action"

type PropertyGrowthListProps = {
  growth: ResonatorPropertyGrowthRow[]
  resonatorId: number
}

/** Growth values of a property, each one deletable. */
export function PropertyGrowthList({
  growth,
  resonatorId,
}: PropertyGrowthListProps) {
  return (
    <EditableSection.List
      className="grid md:grid-cols-2"
      items={growth}
      getItemKey={(entry) => entry.id}
      empty={
        <EditableSection.Text>Sin niveles agregados.</EditableSection.Text>
      }
    >
      {(entry) => (
        <EditableSection.Item size="sm">
          <EditableSection.ItemContent>
            <EditableSection.ItemTitle>
              Nivel {entry.level}
            </EditableSection.ItemTitle>
            <EditableSection.ItemDescription>
              <span className="tabular-nums">{formatGrowthValue(entry)}</span>
            </EditableSection.ItemDescription>
          </EditableSection.ItemContent>

          <EditableSection.ItemActions>
            <PropertyGrowthDeleteAction
              growthId={entry.id}
              resonatorId={resonatorId}
            />
          </EditableSection.ItemActions>
        </EditableSection.Item>
      )}
    </EditableSection.List>
  )
}

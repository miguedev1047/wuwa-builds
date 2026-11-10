import { useSuspenseQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { characterQueries } from "@game-data/queries/characters"

type ResonatorTagsContentProps = {
  resonatorId: number
}

/** Suspended tags of the resonator. */
export function ResonatorTagsContent({
  resonatorId,
}: ResonatorTagsContentProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  return (
    <EditableSection.Content>
      {resonator.tags.length === 0 ? (
        <EditableSection.Text>Sin etiquetas agregadas.</EditableSection.Text>
      ) : (
        <div className="flex flex-wrap gap-2">
          {resonator.tags.map((tag) => (
            <Badge
              key={tag.id}
              variant="secondary"
              title={tag.description}
              className="flex w-full items-center justify-start gap-2"
            >
              <div
                className="size-1 bg-(--tag-color)"
                style={
                  {
                    "--tag-color": `#${tag.color}`,
                  } as React.CSSProperties
                }
              />
              <p>{tag.name}</p>
            </Badge>
          ))}
        </div>
      )}
    </EditableSection.Content>
  )
}

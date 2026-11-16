import { Badge } from "@/components/panelui/badge"
import { Card } from "@/components/panelui/card"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import type { CharacterDetail } from "@catalog/domain/character"

type ResonatorSequencePreviewProps = {
  sequence: CharacterDetail["sequences"][number]
}

/** Hover preview with the node icon, name and catalog description. */
export function ResonatorSequencePreview({
  sequence,
}: ResonatorSequencePreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex min-w-0 items-start gap-3">
        <Show when={sequence.icon} fallback={sequence.index}>
          {(icon) => <Image size="xs" src={icon} alt={sequence.name} />}
        </Show>

        <div className="flex min-w-0 flex-col gap-1">
          <Card.Title className="truncate">{sequence.name}</Card.Title>
          <Badge>Secuencia {sequence.index}</Badge>
        </div>
      </div>

      <div
        className="text-xs/relaxed text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: sequence.description }}
      />
    </div>
  )
}

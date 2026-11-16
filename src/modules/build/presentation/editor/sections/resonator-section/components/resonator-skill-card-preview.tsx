import { Badge } from "@/components/panelui/badge"
import { Card } from "@/components/panelui/card"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import type { CharacterDetail } from "@/modules/catalog/domain/character"

interface ResonatorSkillCardPreviewProps {
  skill: CharacterDetail["skills"][number]
}

export function ResonatorSkillCardPreview({
  skill,
}: ResonatorSkillCardPreviewProps) {
  return (
    <div className="space-y-4">
      <div className="flex min-w-0 items-start gap-3">
        <Show when={skill.icon} fallback={skill.name}>
          {(icon) => <Image size="xs" src={icon} alt={skill.name} />}
        </Show>

        <div className="flex min-w-0 flex-col gap-1">
          <Card.Title className="truncate">{skill.name}</Card.Title>
          <Badge>{skill.type}</Badge>
        </div>
      </div>

      <div
        className="text-xs/relaxed text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: skill.description }}
      />
    </div>
  )
}

import type { ResonatorSkillRow } from "@db/schema"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Show } from "@/components/utility/show"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorSkillDeleteAction } from "@catalog/presentation/resonators/detail/sections/skills/components/resonator-skill-delete-action"
import { ResonatorSkillEditAction } from "@catalog/presentation/resonators/detail/sections/skills/components/resonator-skill-edit-action"

type ResonatorSkillCardProps = {
  skill: ResonatorSkillRow
  resonatorId: number
}

/** Card of one resonator skill. */
export function ResonatorSkillCard({
  skill,
  resonatorId,
}: ResonatorSkillCardProps) {
  return (
    <EditableSection.Card>
      <EditableSection.CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <Show when={skill.icon}>
            {(icon) => (
              <EditableSection.Media variant="image">
                <EditableSection.Image src={icon} alt={skill.name} />
              </EditableSection.Media>
            )}
          </Show>

          <div className="flex min-w-0 flex-col gap-1">
            <EditableSection.CardTitle className="truncate">
              {skill.name}
            </EditableSection.CardTitle>
            <EditableSection.CardDescription>
              {skill.type}
            </EditableSection.CardDescription>
          </div>
        </div>

        <EditableSection.CardAction className="flex items-center gap-1">
          <ResonatorSkillEditAction skill={skill} />
          <ResonatorSkillDeleteAction
            skillId={skill.id}
            resonatorId={resonatorId}
          />
        </EditableSection.CardAction>
      </EditableSection.CardHeader>

      <EditableSection.CardContent>
        <Collapsible>
          <CollapsibleTrigger
            render={
              <Button variant="outline" className="w-full">
                Ver descripción
              </Button>
            }
          />
          <CollapsibleContent className="mt-4 px-2">
            <div
              className="text-xs/relaxed text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: skill.description }}
            />
          </CollapsibleContent>
        </Collapsible>
      </EditableSection.CardContent>
    </EditableSection.Card>
  )
}

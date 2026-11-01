import type { ResonatorSkillRow } from "@/db/schema"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Show } from "@/components/utility/show"
import { ResonatorSkillDeleteAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/skills/components/resonator-skill-delete-action"
import { ResonatorSkillEditAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/skills/components/resonator-skill-edit-action"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

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
    <Card>
      <CardHeader>
        <div className="flex min-w-0 items-start gap-3">
          <Show when={skill.icon}>
            {(icon) => (
              <div className="size-10 shrink-0 overflow-hidden rounded-md bg-accent">
                <img
                  src={icon}
                  alt={skill.name}
                  className="size-full object-cover"
                />
              </div>
            )}
          </Show>

          <div className="flex min-w-0 flex-col gap-1">
            <CardTitle className="truncate">{skill.name}</CardTitle>
            <CardDescription>{skill.type}</CardDescription>
          </div>
        </div>

        <CardAction className="flex items-center gap-1">
          <ResonatorSkillEditAction skill={skill} />
          <ResonatorSkillDeleteAction
            skillId={skill.id}
            resonatorId={resonatorId}
          />
        </CardAction>
      </CardHeader>

      <CardContent>
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
      </CardContent>
    </Card>
  )
}

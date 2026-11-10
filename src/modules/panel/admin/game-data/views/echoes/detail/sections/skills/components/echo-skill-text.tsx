import type { EchoSkillRow } from "@db/schema"
import { Show } from "@/components/utility/show"

type EchoSkillTextProps = {
  skill: EchoSkillRow
}

/** Read-only skill text, split on the `<br>` Encore uses. */
export function EchoSkillText({ skill }: EchoSkillTextProps) {
  return (
    <div className="space-y-4">
      <Show when={skill.icon}>
        {(icon) => (
          <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted/40">
            <img src={icon} alt="" className="size-full object-contain p-1" />
          </div>
        )}
      </Show>

      <div
        className="text-xs/relaxed text-muted-foreground"
        dangerouslySetInnerHTML={{ __html: skill.description }}
      />
    </div>
  )
}

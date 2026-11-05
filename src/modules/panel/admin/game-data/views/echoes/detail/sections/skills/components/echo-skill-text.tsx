import type { EchoSkillRow } from "@/db/schema"
import { Show } from "@/components/utility/show"

type EchoSkillTextProps = {
  skill: EchoSkillRow
}

/** Read-only skill text, split on the `<br>` Encore uses. */
export function EchoSkillText({ skill }: EchoSkillTextProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row">
      <Show when={skill.icon}>
        {(icon) => (
          <div className="size-16 shrink-0 overflow-hidden rounded-lg bg-muted/40">
            <img src={icon} alt="" className="size-full object-contain p-1" />
          </div>
        )}
      </Show>

      <div className="space-y-2">
        {skill.description
          .split("<br>")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line, index) => (
            <p key={index} className="text-sm/relaxed">
              {line}
            </p>
          ))}

        <Show when={skill.simpleDescription}>
          <p className="text-xs/relaxed text-muted-foreground">
            {skill.simpleDescription}
          </p>
        </Show>
      </div>
    </div>
  )
}

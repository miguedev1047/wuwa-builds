import { cn } from "cn"
import type { ResonatorPassivesDataProps } from "@build/domain/build-record"
import type { CharacterDetail } from "@catalog/domain/character"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { Separator } from "@/components/ui/separator"

type SkillsBranchProps = {
  /** Catalog skill and its level in the saved build. */
  skill: CharacterDetail["skills"][number]
  level?: number
  /** Upper and lower passive nodes in this skill branch. */
  passives: (ResonatorPassivesDataProps | undefined)[]
}

/** Compact skill tree branch shared by the canvas and image export. */
export function SkillsBranch({ skill, level, passives }: SkillsBranchProps) {
  return (
    <div className="justify- flex min-w-0 flex-col items-center">
      <div className="relative flex w-full flex-col items-center">
        {passives.map((passive, index) => (
          <Show key={index} when={passive}>
            {(node) => (
              <div
                title={node.name}
                aria-label={[
                  node.name,
                  node.enabled ? "activada" : "desactivada",
                ].join(" ")}
                className={cn(
                  "relative rounded-full",
                  node.enabled ? "" : "opacity-35"
                )}
              >
                <Image
                  src={node.icon}
                  alt={node.name}
                  fit="contain"
                  background="glass"
                  rounded="full"
                  className="size-9 p-1"
                />
                <Separator
                  orientation="vertical"
                  className="mx-auto h-6 w-px"
                />
              </div>
            )}
          </Show>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center">
        <div className="rounded-md bg-accent/50 p-1 shadow-app-surface backdrop-blur-2xl">
          <Image
            src={skill.icon}
            alt={skill.name}
            fit="contain"
            rounded="none"
            className="size-12"
          />
        </div>
        <p className="mt-2 text-xs leading-4 font-semibold tabular-nums">
          Nv. {level ?? "—"}
        </p>
      </div>
    </div>
  )
}

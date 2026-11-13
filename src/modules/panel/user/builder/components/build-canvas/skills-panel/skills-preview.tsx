import type { BuildProps } from "@builds/domain/build-record"
import type { CharacterDetail } from "@game-data/domain/character"
import { Badge } from "@/components/ui/badge"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"

const PREVIEW_SKILLS = 5

/** Read-only preview of the resonator skills and passives. */
export function SkillsPreview({
  resonator,
  build,
}: {
  resonator: CharacterDetail
  build: BuildProps
}) {
  const passives = build.resonator.passives
  const activePassives = passives.filter((passive) => passive.enabled)
  const previewSkills = resonator.skills.slice(0, PREVIEW_SKILLS)

  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Habilidades
        </p>
        <Badge variant="outline">{activePassives.length} activas</Badge>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-5 content-center gap-2">
        <Show
          when={previewSkills.length > 0}
          fallback={Array.from({ length: PREVIEW_SKILLS }).map((_, index) => (
            <div key={index} className="aspect-square rounded-lg bg-muted" />
          ))}
        >
          {previewSkills.map((skill) => (
            <Image
              key={skill.skillId}
              src={skill.icon}
              alt={skill.name}
              size="full"
              rounded="lg"
              background="accent"
              className="aspect-square"
            />
          ))}
        </Show>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{build.resonator.skills.length} habilidades</span>
        <span>{passives.length} pasivas</span>
      </div>
    </div>
  )
}

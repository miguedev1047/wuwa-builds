import { useSuspenseQuery } from "@tanstack/react-query"
import { SkeletonSuspense } from "skullet/react"
import { Badge } from "@/components/ui/badge"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import { SkillsPreviewSkeleton } from "@builder/components/build-canvas/skills-panel/skills-preview-skeleton"
import { characterQueries } from "@game-data/queries/characters"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"

const PREVIEW_SKILLS = 5

/** Read-only preview of the resonator skills and passives. */
export function SkillsPreview() {
  return (
    <SkeletonSuspense skeleton={<SkillsPreviewSkeleton />}>
      <SkillsPreviewLoaded />
    </SkeletonSuspense>
  )
}

/** Loaded content of the skills and passives preview. */
export function SkillsPreviewLoaded() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })
  const resonatorId = build?.resonator.data?.id ?? 0

  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  const passives = build?.resonator.passives ?? []
  const activePassives = passives.filter((passive) => passive.enabled)
  const previewSkills = (resonator?.skills ?? []).slice(0, PREVIEW_SKILLS)

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
        <span>{build?.resonator.skills.length ?? 0} habilidades</span>
        <span>{passives.length} pasivas</span>
      </div>
    </div>
  )
}

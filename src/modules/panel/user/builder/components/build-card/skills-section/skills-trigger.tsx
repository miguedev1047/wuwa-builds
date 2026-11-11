import { useSuspenseQuery } from "@tanstack/react-query"
import { SkeletonSuspense } from "skullet/react"
import { Badge } from "@/components/ui/badge"
import { Image } from "@/components/ui/image"
import { characterQueries } from "@game-data/queries/characters"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"
import { SkillsTriggerSkeleton } from "@builder/components/build-card/skills-section"
import { BuildCardSection } from "@builder/ui/build-card-section"

const PREVIEW_SKILLS = 5

export function SkillsTrigger() {
  return (
    <BuildCardSection className="cursor-pointer">
      <SkeletonSuspense skeleton={<SkillsTriggerSkeleton />}>
        <SkillsTriggerLoaded />
      </SkeletonSuspense>
    </BuildCardSection>
  )
}

/** Compact preview of the resonator skills and passives. */
export function SkillsTriggerLoaded() {
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
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Habilidades
        </p>
        <Badge variant="outline">{activePassives.length} activas</Badge>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-5">
        {previewSkills.length > 0
          ? previewSkills.map((skill) => (
              <Image
                key={skill.skillId}
                src={skill.icon}
                alt={skill.name}
                size="full"
                rounded="lg"
                background="accent"
              />
            ))
          : Array.from({ length: PREVIEW_SKILLS }).map((_, index) => (
              <div key={index} className="size-10 rounded-lg bg-muted" />
            ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>{build?.resonator.skills.length ?? 0} habilidades</span>
        <span>{passives.length} pasivas</span>
      </div>
    </div>
  )
}

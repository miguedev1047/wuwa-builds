import { useBuildCollection } from "@/modules/panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"
import { Show } from "@/components/utility/show"
import { useSuspenseQuery } from "@tanstack/react-query"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { Image } from "@/components/ui/image"
import { DEFAULT_SEQUENCY_RANK } from "@/modules/builds/domain/build"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CardDescription, CardTitle } from "@/components/ui/card"
import { SequencesSkeleton } from "./sequences-skeleton"
import { Suspense } from "react"

export function SequencesContent() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <Suspense fallback={<SequencesSkeleton />}>
      <Show when={build?.resonator.data}>
        {(resonator) => <SequencesContentLoaded resonatorId={resonator.id} />}
      </Show>
    </Suspense>
  )
}

export function SequencesContentLoaded({
  resonatorId,
}: {
  resonatorId: number
}) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  const sequences = resonator.sequences

  const currentSequency = build?.resonator.sequency ?? DEFAULT_SEQUENCY_RANK

  return (
    <div className="flex h-full items-center justify-between">
      {sequences.map((sequency) => (
        <HoverCard key={sequency.id}>
          <HoverCardTrigger
            render={
              <Image
                src={sequency.icon}
                alt={sequency.name + sequency.index}
                size="xs"
                data-active={sequency.index > currentSequency}
                background="accent"
                imgClassName="data-[active=true]:opacity-50"
              />
            }
          />
          <HoverCardContent className="w-150">
            <div className="space-y-4">
              <div className="flex min-w-0 items-start gap-3">
                <Show when={sequency.icon} fallback={sequency.index}>
                  {(icon) => <Image size="xs" src={icon} alt={sequency.name} />}
                </Show>
                <div className="flex min-w-0 flex-col gap-1">
                  <CardTitle className="truncate">{sequency.name}</CardTitle>
                  <CardDescription>Secuencia {sequency.index}</CardDescription>
                </div>
              </div>
              <div
                className="text-xs/relaxed text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: sequency.description }}
              />
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}

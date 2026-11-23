import { Badge } from "@/components/panelui/badge"
import { GameIcon } from "@/components/ui/game-icon"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import type { EchoesDataProps } from "@build/domain/build-record"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import {
  formatPercentStat,
  statIconName,
} from "@build/presentation/helpers/stats-view-model"
import { echoQueries } from "@catalog/queries/echoes"
import { useQuery } from "@tanstack/react-query"
import { cn } from "cn"
import type { ReactNode } from "react"

interface EchoSlotPortraitProps {
  slot: EchoesDataProps
  isMain: boolean
  /** Stable search dialog and trigger, rendered for both slot states. */
  children: ReactNode
}

/** Shows the selected echo alongside its search trigger. */
export function EchoSlotPortrait({
  slot,
  isMain,
  children,
}: EchoSlotPortraitProps) {
  return (
    <div className="space-y-2">
      <Show when={slot.data}>
        {(echo) => (
          <div className="flex items-center justify-between">
            <BuildWorkspace.Text size="sm">{echo.name}</BuildWorkspace.Text>
            <Show when={slot.echoSetId}>
              {(setId) => <EchoSlotSonataIcon echoId={echo.id} setId={setId} />}
            </Show>
          </div>
        )}
      </Show>

      <div className={cn(slot.data && "flex items-center gap-4")}>
        {children}
        <Show when={slot.data}>
          <div className="space-y-2">
            <Show when={isMain}>
              <Badge variant="outline">Eco principal</Badge>
            </Show>
            <Show when={slot.mainStatStat}>
              {(stat) => (
                <>
                  <div className="flex items-center gap-1">
                    <GameIcon
                      name={statIconName(stat)}
                      className="size-5 shrink-0"
                    />
                    <h2 className="truncate text-sm font-bold">
                      {slot.mainStatLabel}
                    </h2>
                  </div>
                  <h2 className="shrink-0 text-2xl font-bold text-highlight tabular-nums">
                    {formatPercentStat(slot.mainStatValue)}
                  </h2>
                </>
              )}
            </Show>
          </div>
        </Show>
      </div>
    </div>
  )
}

function EchoSlotSonataIcon({
  echoId,
  setId,
}: {
  echoId: number
  setId: number
}) {
  const { data: icon } = useQuery({
    ...echoQueries.detail(echoId),
    select: (echo) =>
      echo.sets.find((set) => set.setId === setId)?.sonata?.icon,
  })

  return (
    <Show when={icon}>
      {(src) => (
        <Image
          src={src}
          alt=""
          size="xs"
          rounded="full"
          className="size-5 shrink-0"
        />
      )}
    </Show>
  )
}

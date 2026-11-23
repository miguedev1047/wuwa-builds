import { Show } from "@/components/utility/show"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { GameIcon } from "@/components/ui/game-icon"
import {
  formatEchoStat,
  statIconName,
} from "@build/presentation/helpers/stats-view-model"
import type { EchoSubstatsDataProps } from "@/modules/build/domain/build-record"

interface EchoSotSubstatCardProps {
  substat: EchoSubstatsDataProps
}

export function EchoSotSubstatCard({ substat }: EchoSotSubstatCardProps) {
  const percentValue = substat.valueStat
    ? formatEchoStat(substat.valueStat, substat.valueNumber)
    : "—"

  return (
    <BuildWorkspace.Card
      key={substat.index}
      className="flex min-w-0 items-center justify-between gap-2 bg-input/20 px-3 py-2 text-xs"
    >
      <Show
        when={substat.valueStat}
        fallback={<GameIcon name="lock" className="size-3.5" />}
      >
        {(stat) => (
          <div className="flex min-w-0 items-center gap-1.5">
            <GameIcon name={statIconName(stat)} className="size-3.5 shrink-0" />
            <span className="truncate text-muted-foreground">
              {substat.valueLabel}
            </span>
          </div>
        )}
      </Show>

      <span className="shrink-0 font-bold text-highlight tabular-nums">
        {percentValue}
      </span>
    </BuildWorkspace.Card>
  )
}

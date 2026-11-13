import { GameIcon } from "@/components/ui/game-icon"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import {
  formatEchoStat,
  formatPercentStat,
  statIconName,
} from "@builder/application/stats-view-model"
import type { EchoesDataProps } from "@builds/domain/build-record"
import { BuildWorkspace } from "@builder/components/workspace"
import type { EchoProgress } from "@builder/sections/echoes-section/application/use-echo-progress"
import { EchoSlotActions } from "@builder/sections/echoes-section/components/echo-slot-actions"
import type { EchoDetail } from "@game-data/domain/echo"
import { cn } from "cn"
import { Separator } from "@/components/ui/separator"

type EchoSlotCardProps = {
  slot: EchoesDataProps
  /** Sonata sets of the echo assigned to the slot. */
  sets: EchoDetail["sets"]
  /** True when the slot holds the main echo of the build. */
  isMain: boolean
  /** Icon of the selected sonata set, resolved by the caller. */
  setIcon?: string
  progress: EchoProgress
}

/**
 * Editable card of one echo slot.
 *
 * It is the section counterpart of the read-only `BuildEchoCard`: the canvas
 * keeps the compact artboard card, while the rail stacks these one per row and
 * opens the editor dialog from the card actions.
 */
export function EchoSlotCard({
  slot,
  sets,
  isMain,
  setIcon,
  progress,
}: EchoSlotCardProps) {
  return (
    <Show
      when={slot.data}
      fallback={
        <BuildWorkspace.Empty>
          <BuildWorkspace.EmptyTitle title="Seleccionar eco" />
        </BuildWorkspace.Empty>
      }
    >
      {(echo) => (
        <BuildWorkspace.Card
          cardColor="muted"
          data-echo-main={isMain}
          className={cn(
            "space-y-2",
            "shadow-lg data-[echo-main=true]:border data-[echo-main=true]:border-brand-warning data-[echo-main=true]:shadow-brand-warning/20"
          )}
        >
          <div className="flex items-center justify-between">
            <BuildWorkspace.Text size="sm" className="truncate">
              {echo.name}
            </BuildWorkspace.Text>
            <EchoSlotActions
              slot={slot}
              sets={sets}
              isMain={isMain}
              progress={progress}
            />
          </div>

          <div className="flex items-center justify-between">
            <Image
              src={echo.icon}
              alt={echo.name}
              size="sm"
              rounded="xl"
              background="accent"
            />

            <div className="flex flex-col items-end gap-1">
              <Show when={setIcon}>
                {(icon) => (
                  <Image
                    src={icon}
                    alt=""
                    size="xs"
                    rounded="full"
                    className="size-5 shrink-0"
                  />
                )}
              </Show>

              <h2 className="truncate text-sm font-bold">
                {slot.mainStatLabel}
              </h2>

              <Show when={slot.mainStatStat}>
                {(stat) => (
                  <div className="flex items-center gap-1">
                    <GameIcon
                      name={statIconName(stat)}
                      className="size-5 shrink-0"
                    />
                    <span className="shrink-0 font-bold text-brand-warning tabular-nums">
                      {formatPercentStat(slot.mainStatValue)}
                    </span>
                  </div>
                )}
              </Show>
            </div>
          </div>

          <Separator className="my-4" />

          <ul className="grid gap-2">
            {slot.substats.map((substat) => (
              <li
                key={substat.index}
                className="flex min-w-0 items-center justify-between gap-2 text-xs"
              >
                <Show
                  when={substat.valueStat}
                  fallback={<GameIcon name="lock" className="size-3.5" />}
                >
                  {(stat) => (
                    <div className="flex min-w-0 items-center gap-1.5">
                      <GameIcon
                        name={statIconName(stat)}
                        className="size-3.5 shrink-0"
                      />
                      <span className="truncate text-muted-foreground">
                        {substat.valueLabel}
                      </span>
                    </div>
                  )}
                </Show>

                <span className="shrink-0 font-bold text-brand-warning tabular-nums">
                  {substat.valueStat
                    ? formatEchoStat(substat.valueStat, substat.valueNumber)
                    : "—"}
                </span>
              </li>
            ))}
          </ul>
        </BuildWorkspace.Card>
      )}
    </Show>
  )
}

import { Badge } from "@/components/ui/badge"
import { Empty } from "@/components/ui/empty"
import { GameIcon } from "@/components/ui/game-icon"
import { Image } from "@/components/ui/image"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import {
  formatEchoStat,
  formatPercentStat,
  statIconName,
} from "@builder/application/stats-view-model"
import type { EchoesDataProps } from "@builds/domain/build-record"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "cn"
import { Fragment } from "react"
import { BuildCard } from "../build-card"

type BuildEchoCardProps = {
  slot: EchoesDataProps
  /** True when the slot holds the main echo of the build. */
  isMain: boolean
  /** Icon of the selected sonata set, resolved by the caller. */
  setIcon?: string
  className?: string
}

/**
 * Read-only card of one echo slot.
 *
 * It receives everything it paints as props, so the reading canvas and the
 * editable section can share the same card without sharing state.
 */
export function BuildEchoCard({
  slot,
  isMain,
  setIcon,
  className,
}: BuildEchoCardProps) {
  return (
    <BuildCard className={cn("p-4", className)}>
      <div className="flex h-full flex-col gap-3">
        <Show
          when={slot.data}
          fallback={
            <Empty className="border border-dashed">
              <HugeiconsIcon icon={PlusIcon} className="size-20" />
            </Empty>
          }
        >
          {(echo) => (
            <div className="space-y-4">
              <div className="flex w-full items-center justify-between gap-2">
                <h2 className="truncate text-xs font-bold">{echo.name}</h2>
                <Show when={isMain}>
                  <Badge variant="brand-warning">Eco Main</Badge>
                </Show>
              </div>

              <Separator />

              <div className="space-y-8">
                <div className="flex w-full items-center justify-between gap-3">
                  <Image
                    src={echo.icon}
                    alt={echo.name}
                    size="sm"
                    rounded="xl"
                    background="accent"
                  />

                  <div className="text-end">
                    <Show when={setIcon}>
                      {(icon) => (
                        <Image
                          src={icon}
                          alt=""
                          size="xs"
                          rounded="full"
                          className="mb-1 ml-auto w-6"
                        />
                      )}
                    </Show>

                    <p className="line-clamp-1">{slot.mainStatLabel}</p>

                    <div className="flex items-center justify-end gap-1 text-lg font-bold">
                      <GameIcon
                        name={statIconName(slot.mainStatStat)}
                        className="size-5"
                      />
                      <p className="tabular-nums">
                        {formatPercentStat(slot.mainStatValue)}
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {slot.substats.map((substat, index) => (
                    <Fragment key={`${index || substat.index}-${index}`}>
                      <li className="flex items-center justify-between gap-3 text-xs">
                        <Show
                          when={substat.valueStat}
                          fallback={<GameIcon name="lock" />}
                        >
                          {(stat) => (
                            <div className="flex min-w-0 items-center gap-2">
                              <GameIcon name={statIconName(stat)} />
                              <p className="line-clamp-1">
                                {substat.valueLabel}
                              </p>
                            </div>
                          )}
                        </Show>

                        <p className="shrink-0 font-bold text-brand-warning tabular-nums">
                          {formatEchoStat(
                            substat.valueStat,
                            substat.valueNumber
                          )}
                        </p>
                      </li>

                      <Show when={index < slot.substats.length - 1}>
                        <Separator />
                      </Show>
                    </Fragment>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Show>
      </div>
    </BuildCard>
  )
}

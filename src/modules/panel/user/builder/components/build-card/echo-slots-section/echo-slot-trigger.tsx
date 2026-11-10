import { Badge } from "@/components/ui/badge"
import { GameIcon } from "@/components/ui/game-icon"
import { Image } from "@/components/ui/image"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import type { EchoesDataProps } from "@builds/domain/build-record"
import { STAT_KINDS } from "@builds/domain/stats"
import { isStatId } from "@game-data/application/stats/stats"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildCardSection } from "@builder/ui/build-card-section"
import {
  formatFlatStat,
  formatPercentStat,
} from "@builder/components/build-card/stats-section"
import { Empty } from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusIcon } from "@hugeicons/core-free-icons"

type EchoSlotTriggerProps = {
  slot: EchoesDataProps
  /** Icon of the selected sonata set, resolved by the slots grid. */
  setIcon?: string
}

function formatEchoStat(stat: string, value: number): string {
  return isStatId(stat) && STAT_KINDS[stat] === "flat"
    ? formatFlatStat(value)
    : formatPercentStat(value)
}

function statIconName(stat: string) {
  return isStatId(stat) ? stat : null
}

/** Card that previews one echo slot or its empty state. */
export function EchoSlotTrigger({ slot, setIcon }: EchoSlotTriggerProps) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const isMain = build?.mainEchoSlot === slot.index
  const mainStat = statIconName(slot.mainStatStat)

  return (
    <BuildCardSection className="p-4" interactive>
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
                <h2 className="truncate text-xs">{echo.name}</h2>
                <Show when={isMain}>
                  <Badge variant="outline">Eco Main</Badge>
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
                      <GameIcon name={mainStat} className="size-5" />
                      <p className="tabular-nums">
                        {formatPercentStat(slot.mainStatValue)}
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="space-y-4">
                  {slot.substats.map((substat) => (
                    <li
                      key={substat.index}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <Show
                        when={substat.valueStat}
                        fallback={<GameIcon name="lock" />}
                      >
                        {(stat) => (
                          <div className="flex min-w-0 items-center gap-2">
                            <GameIcon name={statIconName(stat)} />
                            <p className="line-clamp-1">{substat.valueLabel}</p>
                          </div>
                        )}
                      </Show>

                      <p className="shrink-0 font-bold text-brand-warning tabular-nums">
                        {formatEchoStat(substat.valueStat, substat.valueNumber)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Show>
      </div>
    </BuildCardSection>
  )
}

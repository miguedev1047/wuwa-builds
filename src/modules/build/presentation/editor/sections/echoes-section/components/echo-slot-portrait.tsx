import { Image } from "@/components/ui/image"
import type { EchoSummary } from "@/modules/catalog/domain/echo"
import type { EchoesDataProps } from "@/modules/build/domain/build-record"
import { Badge } from "@/components/ui/badge"
import { Show } from "@/components/utility/show"
import { GameIcon } from "@/components/ui/game-icon"
import {
  formatPercentStat,
  statIconName,
} from "../../../hooks/stats-view-model"
import { BuildWorkspace } from "../../../components/workspace"
import { EchoPicker } from "./echo-picker"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowDataTransferHorizontalIcon } from "@hugeicons/core-free-icons"

interface EchoSlotPortraitProps {
  echo: EchoSummary
  slot: EchoesDataProps
  isMain: boolean
  setIcon?: string
}

export function EchoSlotPortrait({
  echo,
  slot,
  isMain,
  setIcon,
}: EchoSlotPortraitProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <BuildWorkspace.Text size="sm">{echo.name}</BuildWorkspace.Text>

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
      </div>

      <div className="flex items-center gap-4">
        <BuildWorkspace.Dialog
          title="Cambia el eco"
          description={`El eco elegido se asignará al slot ${slot.index + 1}.`}
          triggerComponent={
            <button className="group/image relative overflow-hidden rounded-lg">
              <Image
                src={echo.icon}
                alt={echo.name}
                background="accent"
                aspect="square"
                size="md"
              />
              <div className="absolute inset-0 grid place-content-center opacity-0 transition duration-200 ease-in-out group-hover/image:bg-black/50 group-hover/image:opacity-100">
                <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
              </div>
            </button>
          }
        >
          {({ close }) => (
            <EchoPicker slot={slot} columns={4} onSelected={close} />
          )}
        </BuildWorkspace.Dialog>

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
                <h2 className="shrink-0 text-2xl font-bold text-brand-warning tabular-nums">
                  {formatPercentStat(slot.mainStatValue)}
                </h2>
              </>
            )}
          </Show>
        </div>
      </div>
    </div>
  )
}

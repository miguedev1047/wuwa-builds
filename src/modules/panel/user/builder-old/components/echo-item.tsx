import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { buildCollection } from "@/modules/builds/client/build-store"
import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import type { EchoSummary } from "@/modules/game-data/domain/echo"
import { selectEchoSlot } from "@/modules/panel/user/builder-old/application/echo-slots"
import { cn } from "cn"

interface EchoItemProps {
  echo: EchoSummary
  echoSlot: EchoesDataProps
  buildId: string
  onSelect: () => void
}

/** One echo option inside the picker. */
export function EchoItem({ echo, echoSlot, buildId, onSelect }: EchoItemProps) {
  const isSelected = echoSlot.data?.id === echo.id

  const handleSelect = () => {
    buildCollection.update(buildId, (current) => {
      current.echoes = selectEchoSlot({
        echoes: current.echoes ?? [],
        targetIndex: echoSlot.index,
        echo,
      })
      current.updateAt = new Date().toISOString()
    })

    onSelect()
  }

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <figure
            role="button"
            onClick={handleSelect}
            data-selected={isSelected}
            className={cn(
              "aspect-square overflow-hidden bg-accent",
              "data-[selected=true]:outline-2"
            )}
          >
            <img
              src={echo.icon}
              alt={echo.name}
              className="size-full object-cover"
            />
          </figure>
        }
      />
      <TooltipContent>{echo.name}</TooltipContent>
    </Tooltip>
  )
}

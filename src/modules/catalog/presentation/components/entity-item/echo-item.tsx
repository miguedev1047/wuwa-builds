import { Tooltip } from "@/components/panelui/tooltip"
import { EntityItem } from "@catalog/presentation/components/entity-item/entity-item"
import { cn } from "cn"

/** Minimal echo shape accepted by the item, from D1 or Encore. */
export type EchoItemData = {
  name: string
  icon: string
}

type EchoItemProps = {
  echo: EchoItemData
  className?: string
}

/** Reusable echo thumbnail used by catalog lists and searches. */
export function EchoItem({ echo, className }: EchoItemProps) {
  return (
    <Tooltip>
      <Tooltip.Trigger
        render={
          <EntityItem
            src={echo.icon}
            alt={echo.name}
            aria-label={echo.name}
            className={cn("size-full", className)}
          />
        }
      />
      <Tooltip.Content>{echo.name}</Tooltip.Content>
    </Tooltip>
  )
}

import { Tooltip } from "@/components/panelui/tooltip"
import { GameIcon, gameIconName } from "@/components/ui/game-icon"
import { Show } from "@/components/utility/show"
import { EntityItem } from "@catalog/presentation/components/entity-item/entity-item"
import { cn } from "cn"

/** Minimal weapon shape accepted by the item, from D1 or Encore. */
export type WeaponItemData = {
  name: string
  icon: string
  type: "broadblade" | "gauntlets" | "pistols" | "sword" | "rectifier"
}

type WeaponItemProps = {
  weapon: WeaponItemData
  className?: string
  showStatus?: boolean
}

/** Curation status badges pinned over one resonator portrait. */
function WeaponStatusBadges({ weapon }: { weapon: WeaponItemData }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-between gap-1 p-1">
      <Show when={weapon.type}>
        <GameIcon className="size-8" name={gameIconName(weapon.type)} />
      </Show>
    </div>
  )
}

/** Reusable weapon thumbnail used by catalog lists and searches. */
export function WeaponItem({
  weapon,
  showStatus = true,
  className,
}: WeaponItemProps) {
  return (
    <Tooltip>
      <Tooltip.Trigger
        render={
          <EntityItem
            src={weapon.icon}
            alt={weapon.name}
            aria-label={weapon.name}
            className={cn(className)}
          />
        }
      >
        <Show when={showStatus}>
          <WeaponStatusBadges weapon={weapon} />
        </Show>
      </Tooltip.Trigger>
      <Tooltip.Content>{weapon.name}</Tooltip.Content>
    </Tooltip>
  )
}

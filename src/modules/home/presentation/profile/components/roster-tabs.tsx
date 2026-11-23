import { Card } from "@/components/panelui/card"
import { Tabs } from "@/components/panelui/tabs"
import { Tooltip } from "@/components/panelui/tooltip"
import { Image } from "@/components/ui/image"
import type { ProfileRoster } from "@home/domain/profile-roster"

type RosterTabsProps = {
  /** Available resonators in display order. */
  rosters: readonly ProfileRoster[]
}

/** Renders the scrollable row of square resonator images. */
export function RosterTabs({ rosters }: RosterTabsProps) {
  return (
    <Card size="sm">
      <Tabs.List aria-label="Resonadores con builds">
        {rosters.map(({ characterId, name, icon }) => (
          <Tooltip key={characterId}>
            <Tabs.Trigger
              value={characterId}
              aria-label={name}
              render={<Tooltip.Trigger />}
            >
              <Image src={icon ?? ""} alt="" size="full" rounded="none" />
            </Tabs.Trigger>
            <Tooltip.Content>{name}</Tooltip.Content>
          </Tooltip>
        ))}
      </Tabs.List>
    </Card>
  )
}

import { RouteNavigation } from "@/components/blocks/route-navigation"
import { Tabs } from "@/components/panelui/tabs"
import type { ProfileRoster } from "@home/domain/profile-roster"
import { RosterList } from "@home/presentation/profile/components/roster-list"
import { RosterTabs } from "@home/presentation/profile/components/roster-tabs"
import { useId, useState } from "react"

type RosterContainerProps = {
  /** Profile account and signed-in visitor for scoped card queries. */
  userId: string
  viewerId: string | null
  /** Visible resonator groups returned by the profile loader. */
  rosters: readonly ProfileRoster[]
}

/** Renders a roster section when the profile has eligible builds. */
export function RosterContainer({
  userId,
  viewerId,
  rosters,
}: RosterContainerProps) {
  const titleId = useId()
  const [selectedId, setSelectedId] = useState(rosters[0]?.characterId)
  const active =
    rosters.find(({ characterId }) => characterId === selectedId) ?? rosters[0]

  if (!active) return null
  if (active.characterId !== selectedId) setSelectedId(active.characterId)

  return (
    <section
      aria-labelledby={titleId}
      className="grid min-w-0 grid-cols-1 gap-4"
    >
      <RouteNavigation.Header variant="inline">
        <RouteNavigation.Title id={titleId} as="h2">
          Rosters
        </RouteNavigation.Title>
      </RouteNavigation.Header>
      <Tabs
        variant="tiles"
        value={active.characterId}
        onValueChange={setSelectedId}
      >
        <RosterTabs rosters={rosters} />
        {rosters.map((roster) => (
          <Tabs.Content key={roster.characterId} value={roster.characterId}>
            <RosterList userId={userId} viewerId={viewerId} roster={roster} />
          </Tabs.Content>
        ))}
      </Tabs>
    </section>
  )
}

import { Tooltip } from "@/components/panelui/tooltip"
import type { BuildProps } from "@build/domain/build-record"
import { RosterBuildItem } from "@build/presentation/collection/sections/roster-builds/components/roster-build-item"

type RosterBuildsListProps = {
  /** Builds that belong to the selected roster. */
  builds: readonly BuildProps[]
}

/** Grid of the builds that belong to the selected roster. */
export function RosterBuildsList({ builds }: RosterBuildsListProps) {
  return (
    <Tooltip.Provider>
      <ul className="grid grid-cols-2 gap-4">
        {builds.map((build) => (
          <RosterBuildItem key={build.buildId} build={build} />
        ))}
      </ul>
    </Tooltip.Provider>
  )
}

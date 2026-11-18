import { Tooltip } from "@/components/panelui/tooltip"
import type { BuildProps } from "@build/domain/build-record"
import { UnassignedBuildItem } from "@build/presentation/collection/sections/unassigned-builds/components/unassigned-build-item"

type UnassignedBuildsListProps = {
  /** Builds that still have no resonator. */
  builds: readonly BuildProps[]
}

/** Grid of drafts that link directly to their editor. */
export function UnassignedBuildsList({ builds }: UnassignedBuildsListProps) {
  return (
    <Tooltip.Provider>
      <ul className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-8">
        {builds.map((build) => (
          <UnassignedBuildItem key={build.buildId} build={build} />
        ))}
      </ul>
    </Tooltip.Provider>
  )
}

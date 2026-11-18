import { useRosterBuilds } from "@build/client/hooks/build-live-queries"
import { BuildsEmpty } from "@build/presentation/collection/components/builds-empty"
import { RosterBuildsList } from "@build/presentation/collection/sections/roster-builds/components/roster-builds-list"
import { UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type RosterBuildsSheetContentProps = {
  /** Resonator whose builds are listed. */
  rosterId: number
  /** Session that owns the local builds. */
  sessionId: string
}

/** Loads the builds that belong to the selected roster. */
export function RosterBuildsSheetContent({
  rosterId,
  sessionId,
}: RosterBuildsSheetContentProps) {
  const { data: builds } = useRosterBuilds(rosterId, sessionId)

  if (builds.length === 0) {
    return (
      <BuildsEmpty
        icon={<HugeiconsIcon icon={UserIcon} />}
        title="Este resonador no tiene builds"
        description="Crea una build para este resonador y aparecerá aquí."
      />
    )
  }

  return <RosterBuildsList builds={builds} />
}

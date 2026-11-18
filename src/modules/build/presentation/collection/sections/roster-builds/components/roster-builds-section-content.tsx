import { useSessionRosters } from "@build/client/hooks/build-live-queries"
import { BuildsEmpty } from "@build/presentation/collection/components/builds-empty"
import { RosterBuildsSheet } from "@build/presentation/collection/sections/roster-builds/components/roster-builds-sheet"
import { RosterList } from "@build/presentation/collection/sections/roster-builds/components/roster-list"
import { UserIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type RosterBuildsSectionContentProps = {
  /** Session that owns the local builds. */
  sessionId: string
}

/** Loads the rosters and owns the selected roster for the Sheet. */
export function RosterBuildsSectionContent({
  sessionId,
}: RosterBuildsSectionContentProps) {
  const { data: rosters } = useSessionRosters(sessionId)
  const [selectedRosterId, setSelectedRosterId] = useState<number | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  const selectedRoster =
    rosters.find(({ resonatorId }) => resonatorId === selectedRosterId) ?? null

  if (rosters.length === 0) {
    return (
      <BuildsEmpty
        icon={<HugeiconsIcon icon={UserIcon} />}
        title="Todavía no tienes builds con resonador"
        description="Cuando asignes un resonador a una build, aparecerá aquí."
      />
    )
  }

  return (
    <>
      <RosterList
        rosters={rosters}
        onSelect={(resonatorId) => {
          setSelectedRosterId(resonatorId)
          setSheetOpen(true)
        }}
      />
      <RosterBuildsSheet
        roster={selectedRoster}
        sessionId={sessionId}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onOpenChangeComplete={(open) => {
          if (!open) setSelectedRosterId(null)
        }}
      />
    </>
  )
}

import { Spinner } from "@/components/panelui/spinner"
import { RosterBuildsSectionContent } from "@build/presentation/collection/sections/roster-builds/components/roster-builds-section-content"
import { Suspense } from "react"

type RosterBuildsSectionProps = {
  /** User that owns the local builds. */
  userId: string
}

/** Section with the builds grouped by their resonator. */
export function RosterBuildsSection({ userId }: RosterBuildsSectionProps) {
  return (
    <Suspense fallback={<Spinner />}>
      <RosterBuildsSectionContent userId={userId} />
    </Suspense>
  )
}

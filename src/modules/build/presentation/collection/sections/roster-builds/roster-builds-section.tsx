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
    <section className="space-y-2">
      <h3 className="text-sm font-medium">Tus builds</h3>
      <Suspense fallback={<Spinner />}>
        <RosterBuildsSectionContent userId={userId} />
      </Suspense>
    </section>
  )
}

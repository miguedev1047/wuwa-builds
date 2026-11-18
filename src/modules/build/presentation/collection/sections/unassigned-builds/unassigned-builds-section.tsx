import { UnassignedBuildsSectionContent } from "@build/presentation/collection/sections/unassigned-builds/components/unassigned-builds-section-content"
import { Suspense } from "react"

type UnassignedBuildsSectionProps = {
  /** Session that owns the local builds. */
  sessionId: string
}

/** Section with the drafts that still have no resonator. */
export function UnassignedBuildsSection({
  sessionId,
}: UnassignedBuildsSectionProps) {
  return (
    <Suspense fallback={null}>
      <UnassignedBuildsSectionContent sessionId={sessionId} />
    </Suspense>
  )
}

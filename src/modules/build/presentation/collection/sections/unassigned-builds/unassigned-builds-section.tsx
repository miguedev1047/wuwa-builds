import { UnassignedBuildsSectionContent } from "@build/presentation/collection/sections/unassigned-builds/components/unassigned-builds-section-content"
import { Suspense } from "react"

type UnassignedBuildsSectionProps = {
  /** User that owns the local builds. */
  userId: string
}

/** Section with the drafts that still have no resonator. */
export function UnassignedBuildsSection({
  userId,
}: UnassignedBuildsSectionProps) {
  return (
    <Suspense fallback={null}>
      <UnassignedBuildsSectionContent userId={userId} />
    </Suspense>
  )
}

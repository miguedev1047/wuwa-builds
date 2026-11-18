import { useUnassignedBuilds } from "@build/client/hooks/build-live-queries"
import { UnassignedBuildsList } from "@build/presentation/collection/sections/unassigned-builds/components/unassigned-builds-list"

type UnassignedBuildsSectionContentProps = {
  /** Session that owns the local builds. */
  sessionId: string
}

/** Loads and paints the builds that still have no resonator. */
export function UnassignedBuildsSectionContent({
  sessionId,
}: UnassignedBuildsSectionContentProps) {
  const { data: builds } = useUnassignedBuilds(sessionId)

  if (builds.length === 0) return null

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-medium">Builds sin resonador</h3>
      <UnassignedBuildsList builds={builds} />
    </section>
  )
}

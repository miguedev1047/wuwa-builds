import { Separator } from "@/components/ui/separator"
import { useUnassignedBuilds } from "@build/client/hooks/build-live-queries"
import { UnassignedBuildsList } from "@build/presentation/collection/sections/unassigned-builds/components/unassigned-builds-list"

type UnassignedBuildsSectionContentProps = {
  /** User that owns the local builds. */
  userId: string
}

/** Loads and paints the builds that still have no resonator. */
export function UnassignedBuildsSectionContent({
  userId,
}: UnassignedBuildsSectionContentProps) {
  const { data: builds } = useUnassignedBuilds(userId)

  if (builds.length === 0) return null

  return (
    <>
      <Separator />
      <UnassignedBuildsList builds={builds} />
    </>
  )
}

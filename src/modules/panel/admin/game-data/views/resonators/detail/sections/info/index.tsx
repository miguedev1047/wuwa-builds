import { useParams } from "@tanstack/react-router"
import { SkeletonSuspense } from "skullet/react"
import { ResonatorInfoContent } from "@panel/admin/game-data/views/resonators/detail/sections/info/components/resonator-info-content"
import { ResonatorInfoSkeleton } from "@panel/admin/game-data/views/resonators/detail/sections/info/components/resonator-info-skeleton"

/** Summary (`resonators`) of the resonator. */
export function ResonatorInfoSection() {
  const { id } = useParams({ from: "/(panel)/admin/resonators/$id" })
  const resonatorId = Number(id)

  return (
    <SkeletonSuspense skeleton={<ResonatorInfoSkeleton />}>
      <ResonatorInfoContent resonatorId={resonatorId} />
    </SkeletonSuspense>
  )
}

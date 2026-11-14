import { Suspense } from "react"
import { ResonatorInfoContent } from "@catalog/presentation/resonators/detail/sections/info/components/resonator-info-content"
import { ResonatorInfoSkeleton } from "@catalog/presentation/resonators/detail/sections/info/components/resonator-info-skeleton"

/** Summary (`resonators`) of the resonator. */
export function ResonatorInfoSection({ resonatorId }: { resonatorId: number }) {
  return (
    <Suspense fallback={<ResonatorInfoSkeleton />}>
      <ResonatorInfoContent resonatorId={resonatorId} />
    </Suspense>
  )
}

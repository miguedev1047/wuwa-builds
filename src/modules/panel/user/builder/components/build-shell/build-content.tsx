import { SkeletonSuspense } from "skullet/react"
import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import {
  BuildCardGrid,
  ResonatorGrid,
  ResonatorListLoading,
} from "@builder/components/build-card"
import { ResonatorSection } from "@builder/sections/resonator-section"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"

/**
 * Body of the builder route.
 *
 * A build without a resonator shows the catalog grid; once one is selected the
 * editor sections and the downloadable card render together.
 */
export function BuildContent() {
  const buildId = useBuilderId()
  const { data } = useBuildCollection({ buildId })

  return (
    <Show
      when={data?.resonator.data}
      fallback={
        <div className="space-y-3 rounded-2xl border border-dashed p-6">
          <SkeletonSuspense
            skeleton={<ResonatorListLoading columns={10} aspect="portrait" />}
          >
            <ResonatorGrid buildId={buildId} columns={10} aspect="portrait" />
          </SkeletonSuspense>
        </div>
      }
    >
      <ResonatorSection />
      <BuildCardGrid />
    </Show>
  )
}

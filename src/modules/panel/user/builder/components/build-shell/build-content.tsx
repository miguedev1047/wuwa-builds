import { SkeletonSuspense } from "skullet/react"
import { useBuilderId } from "@builder/application/use-builder-id"
import {
  BuildCardGrid,
  ResonatorGrid,
  ResonatorListLoading,
} from "@builder/components/build-card"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { Show } from "@/components/utility/show"

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
      <BuildCardGrid />
    </Show>
  )
}

import { SkeletonSuspense } from "skullet/react"
import {
  ResonatorGrid,
  ResonatorListLoading,
  ResonatorSelectorDialog,
} from "@builder/components/resonator-selector"
import { useBuilderId } from "@builder/application/use-builder-id"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { Show } from "@/components/utility/show"
import { BuildResonatorPortrait } from "@builder/components/build-shell/build-resonator-portrait"
import { BuildCardGrid } from "@builder/components/build-card"

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
      <div className="relative h-full w-full">
        <ResonatorSelectorDialog trigger={<BuildResonatorPortrait />} />
        <BuildCardGrid />
      </div>
    </Show>
  )
}

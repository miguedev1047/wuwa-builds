import { SkeletonSuspense } from "skullet/react"
import {
  ResonatorGrid,
  ResonatorListLoading,
  ResonatorSelectorDialog,
} from "../resonator-selector"
import { useBuilderId } from "../../application/use-builder-id"
import { useBuildCollection } from "../../../builds/application/build-live-queries"
import { Show } from "@/components/utility/show"
import { BuildResonatorPortrait } from "./build-resonator-portrait"
import { BuildCardGrid } from "../build-card"

export function BuildContent() {
  const buildId = useBuilderId()
  const { data } = useBuildCollection({ buildId })

  return (
    <Show
      when={data?.resonator.data}
      fallback={
        <div className="space-y-3 rounded-2xl border border-dashed p-6">
          <SkeletonSuspense
            skeleton={<ResonatorListLoading columns={8} aspect="portrait" />}
          >
            <ResonatorGrid buildId={buildId} columns={8} aspect="portrait" />
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

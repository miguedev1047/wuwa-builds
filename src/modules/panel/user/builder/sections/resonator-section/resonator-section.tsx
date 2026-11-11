import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import { ResonatorSectionContent } from "@builder/sections/resonator-section/components/resonator-section-content"
import { ResonatorSectionSkeleton } from "@builder/sections/resonator-section/components/resonator-skeleton"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { Suspense } from "react"

/** Editable resonator section of the builder. */
export function ResonatorSection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <Show when={build}>
      {(currentBuild) => (
        <Show when={currentBuild.resonator.data}>
          {(resonator) => (
            <Suspense fallback={<ResonatorSectionSkeleton />}>
              <ResonatorSectionContent
                build={currentBuild}
                resonatorId={resonator.id}
              />
            </Suspense>
          )}
        </Show>
      )}
    </Show>
  )
}

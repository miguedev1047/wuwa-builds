import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import { ResonatorSectionContent } from "@builder/sections/resonator-section/components/resonator-section-content"
import { ResonatorSectionLoading } from "@builder/sections/resonator-section/ui-states"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { Suspense } from "react"
import { BuildCardSection } from "@builder/ui/build-card-section"
import { ResonatorGrid } from "@builder/sections/resonator-section/components/resonator-grid"

/** Editable resonator section of the builder. */
export function ResonatorBuilderSection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <BuildCardSection>
      <Show when={build}>
        {(currentBuild) => (
          <Show
            when={currentBuild.resonator.data}
            fallback={
              <ResonatorGrid
                buildId={currentBuild.buildId}
                columns={8}
                aspect="portrait"
              />
            }
          >
            {(resonator) => (
              <Suspense fallback={<ResonatorSectionLoading />}>
                <ResonatorSectionContent
                  build={currentBuild}
                  resonatorId={resonator.id}
                />
              </Suspense>
            )}
          </Show>
        )}
      </Show>
    </BuildCardSection>
  )
}

import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import { ResonatorSectionContent } from "@builder/sections/resonator-section/components/resonator-section-content"
import { ResonatorSectionLoading } from "@builder/sections/resonator-section/ui-states"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { Suspense } from "react"
import { BuildWorkspace } from "@builder/components/workspace"
import { ResonatorPickerDialog } from "@builder/sections/resonator-section/components/resonator-picker-dialog"

/** Editable resonator section of the builder. */
export function ResonatorBuilderSection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <BuildWorkspace.Card>
      <Show when={build}>
        {(currentBuild) => (
          <Show
            when={currentBuild.resonator.data}
            fallback={<ResonatorPickerDialog />}
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
    </BuildWorkspace.Card>
  )
}

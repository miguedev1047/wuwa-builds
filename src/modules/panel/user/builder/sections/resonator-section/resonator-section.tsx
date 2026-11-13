import type { BuildProps } from "@builds/domain/build-record"
import { Show } from "@/components/utility/show"
import { ResonatorSectionContent } from "@builder/sections/resonator-section/components/resonator-section-content"
import { ResonatorSectionLoading } from "@builder/sections/resonator-section/ui-states"
import { Suspense } from "react"
import { BuildWorkspace } from "@builder/components/workspace"
import { ResonatorPickerDialog } from "@builder/sections/resonator-section/components/resonator-picker-dialog"

/** Editable resonator section of the builder. */
export function ResonatorBuilderSection({ build }: { build: BuildProps }) {
  return (
    <BuildWorkspace.Card>
      <Show when={build}>
        {(currentBuild) => (
          <Show
            when={currentBuild.resonator.data}
            fallback={<ResonatorPickerDialog build={currentBuild} />}
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

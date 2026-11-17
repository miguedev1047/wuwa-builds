import type { BuildProps } from "@build/domain/build-record"
import { Show } from "@/components/utility/show"
import { ResonatorSectionContent } from "@build/presentation/editor/sections/resonator-section/components/resonator-section-content"
import { ResonatorSectionLoading } from "@build/presentation/editor/sections/resonator-section/ui-states"
import { Suspense } from "react"
import { ResonatorBuildSearch } from "@build/presentation/editor/searches/resonators"

/** Editable resonator section of the builder. */
export function ResonatorEditorSection({ build }: { build: BuildProps }) {
  return (
    <Show when={build}>
      {(currentBuild) => (
        <Show
          when={currentBuild.resonator.data}
          fallback={<ResonatorBuildSearch build={currentBuild} />}
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
  )
}

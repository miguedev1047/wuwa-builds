import { Show } from "@/components/utility/show"
import { useBuilderId } from "@builder/application/use-builder-id"
import { EchoesSectionContent } from "@builder/sections/echoes-section/components/echoes-section-content"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { BuildWorkspace } from "@builder/components/workspace"

/** Editable echoes section of the builder. */
export function EchoesBuilderSection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <BuildWorkspace.Card>
      <Show when={build}>
        {(current) => <EchoesSectionContent build={current} />}
      </Show>
    </BuildWorkspace.Card>
  )
}

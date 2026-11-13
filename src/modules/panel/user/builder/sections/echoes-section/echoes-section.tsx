import type { BuildProps } from "@builds/domain/build-record"
import { Show } from "@/components/utility/show"
import { EchoesSectionContent } from "@builder/sections/echoes-section/components/echoes-section-content"
import { BuildWorkspace } from "@builder/components/workspace"

/** Editable echoes section of the builder. */
export function EchoesBuilderSection({ build }: { build: BuildProps }) {
  return (
    <BuildWorkspace.Card>
      <Show when={build}>
        {(current) => <EchoesSectionContent build={current} />}
      </Show>
    </BuildWorkspace.Card>
  )
}

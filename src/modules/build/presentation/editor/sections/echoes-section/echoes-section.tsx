import type { BuildProps } from "@build/domain/build-record"
import { Show } from "@/components/utility/show"
import { EchoesSectionContent } from "@build/presentation/editor/sections/echoes-section/components/echoes-section-content"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

/** Editable echoes section of the builder. */
export function EchoesEditorSection({ build }: { build: BuildProps }) {
  return (
    <BuildWorkspace.Card>
      <Show when={build}>
        {(current) => <EchoesSectionContent build={current} />}
      </Show>
    </BuildWorkspace.Card>
  )
}

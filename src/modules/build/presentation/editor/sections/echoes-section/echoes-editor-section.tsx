import type { BuildProps } from "@build/domain/build-record"
import { Show } from "@/components/utility/show"
import { EchoesEditorContent } from "@build/presentation/editor/sections/echoes-section/components/echoes-editor-content"

/** Editable echoes section of the builder. */
export function EchoesEditorSection({ build }: { build: BuildProps }) {
  return (
    <Show when={build}>
      {(current) => <EchoesEditorContent build={current} />}
    </Show>
  )
}

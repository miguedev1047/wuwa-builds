import type { BuildProps } from "@build/domain/build-record"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { Show } from "@/components/utility/show"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { EchoSlotEditor } from "@build/presentation/editor/sections/echoes-section/components/echo-slot-editor"
import { EchoSlotTabs } from "@build/presentation/editor/sections/echoes-section/components/echo-slot-tabs"

type EchoesEditorContentProps = {
  build: BuildProps
}

/** Loaded echoes section: five editable slots. */
export function EchoesEditorContent({ build }: EchoesEditorContentProps) {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0)

  const echoSlotsCount = build.echoes.filter((e) => e.data !== null).length
  const echoSlotsMaxCount = build.echoes.length

  return (
    <Show
      when={build.resonator.data}
      fallback={
        <BuildWorkspace.Empty enabled={false}>
          <BuildWorkspace.EmptyTitle title="Primero selecciona un resonador" />
        </BuildWorkspace.Empty>
      }
    >
      <div className="flex w-full flex-col items-start gap-2">
        <div className="flex w-full items-center justify-between">
          <BuildWorkspace.Text family="bold" textColor="muted" size="xl">
            Ecos
          </BuildWorkspace.Text>
          <p className="text-xs font-bold text-muted-foreground tabular-nums">
            {echoSlotsCount}/{echoSlotsMaxCount}
          </p>
        </div>

        <div className="w-full space-y-5">
          <EchoSlotTabs
            build={build}
            selectedSlotIndex={selectedSlotIndex}
            onSlotChange={setSelectedSlotIndex}
          />
          <Separator />
          <EchoSlotEditor
            build={build}
            slot={build.echoes[selectedSlotIndex]}
          />
        </div>
      </div>
    </Show>
  )
}

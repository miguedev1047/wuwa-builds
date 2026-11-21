import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import type { BuildProps, EchoesDataProps } from "@build/domain/build-record"
import { EchoBuildSearch } from "@build/presentation/editor/searches/echoes"
import { EchoSlotControls } from "@build/presentation/editor/sections/echoes-section/components/echo-slot-controls"
import { EchoSlotPortrait } from "@build/presentation/editor/sections/echoes-section/components/echo-slot-portrait"
import { EchoSlotRemoveButton } from "@build/presentation/editor/sections/echoes-section/components/echo-slot-remove-button"
import { EchoSlotSearchTrigger } from "@build/presentation/editor/sections/echoes-section/components/echo-slot-search-trigger"

interface EchoSlotEditorProps {
  build: BuildProps
  slot: EchoesDataProps
}

/** Keeps the slot's search mounted while its equipment and controls change. */
export function EchoSlotEditor({ build, slot }: EchoSlotEditorProps) {
  const isMain = build.mainEchoSlot === slot.index

  return (
    <>
      <EchoSlotPortrait slot={slot} isMain={isMain}>
        <EchoBuildSearch
          key={slot.index}
          slotIndex={slot.index}
          selectedEchoId={slot.data?.id}
          resonatorId={build.resonator.data?.id ?? 0}
          trigger={<EchoSlotSearchTrigger echo={slot.data} />}
        />
      </EchoSlotPortrait>
      <Show when={slot.data}>
        {(echo) => (
          <>
            <Separator />
            <EchoSlotControls
              key={slot.index}
              build={build}
              slot={slot}
              echoId={echo.id}
              isMain={isMain}
            />
          </>
        )}
      </Show>
      <EchoSlotRemoveButton build={build} slotIndex={slot.index} />
    </>
  )
}

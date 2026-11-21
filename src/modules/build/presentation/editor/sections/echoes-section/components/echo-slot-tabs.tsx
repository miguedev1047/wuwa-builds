import { Show } from "@/components/utility/show"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusIcon } from "@hugeicons/core-free-icons"
import type { BuildProps } from "@/modules/build/domain/build-record"
import { EchoItem } from "@catalog/presentation/components/entity-item"

interface EchoSlotTabsProps {
  build: BuildProps
  selectedSlotIndex: number
  onSlotChange: (slotIndex: number) => void
}

/** Selects which echo slot the editor displays. */
export function EchoSlotTabs({
  build,
  selectedSlotIndex,
  onSlotChange,
}: EchoSlotTabsProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {build.echoes.map((slot, index) => (
        <BuildWorkspace.Card
          key={slot.index}
          onClick={() => onSlotChange(index)}
          role="button"
          cardColor="input"
          data-active={selectedSlotIndex === index}
          className="grid aspect-square place-content-center overflow-hidden border p-0 data-[active=true]:border-highlight data-[active=true]:shadow-lg/20 data-[active=true]:shadow-highlight"
        >
          <Show when={slot.data} fallback={<HugeiconsIcon icon={PlusIcon} />}>
            {(echo) => <EchoItem echo={echo} className="rounded-none" />}
          </Show>
        </BuildWorkspace.Card>
      ))}
    </div>
  )
}

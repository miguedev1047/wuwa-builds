import { Show } from "@/components/utility/show"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusIcon } from "@hugeicons/core-free-icons"
import type { BuildProps } from "@/modules/build/domain/build-record"

interface EchoesTabsProps {
  build: BuildProps
  selectedEchoIndex: number
  setSelectedEchoIndex: (value: number) => void
}

export function EchoesTabs({
  build,
  selectedEchoIndex,
  setSelectedEchoIndex,
}: EchoesTabsProps) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {build.echoes.map((slot, index) => (
        <BuildWorkspace.Card
          onClick={() => setSelectedEchoIndex(index)}
          role="button"
          cardColor="input"
          data-active={selectedEchoIndex === index}
          className="grid aspect-square place-content-center overflow-hidden border p-0 data-[active=true]:border-highlight data-[active=true]:shadow-lg/20 data-[active=true]:shadow-highlight"
        >
          <Show when={slot.data} fallback={<HugeiconsIcon icon={PlusIcon} />}>
            {(echo) => (
              <Show when={slot.data?.icon}>
                {(icon) => (
                  <img
                    src={icon}
                    alt={echo.name}
                    className="pointer-events-none size-full object-contain select-none"
                  />
                )}
              </Show>
            )}
          </Show>
        </BuildWorkspace.Card>
      ))}
    </div>
  )
}

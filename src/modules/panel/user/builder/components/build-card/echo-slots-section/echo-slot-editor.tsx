import { SkeletonSuspense } from "skullet/react"
import { Image } from "@/components/ui/image"
import { Show } from "@/components/utility/show"
import type { EchoesDataProps } from "@/modules/builds/domain/build-record"
import { EchoLevel } from "./echo-level"
import { EchoMainToggle } from "./echo-main-toggle"
import { EchoPicker } from "./echo-picker"
import { EchoPickerSkeleton } from "./echo-picker-skeleton"

type EchoSlotEditorProps = {
  slot: EchoesDataProps
}

/** Picker and controls of one echo slot. */
export function EchoSlotEditor({ slot }: EchoSlotEditorProps) {
  return (
    <div className="space-y-6">
      <SkeletonSuspense skeleton={<EchoPickerSkeleton />}>
        <EchoPicker slot={slot} />
      </SkeletonSuspense>

      <Show when={slot.data}>
        {(echo) => (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-3">
              <Image
                src={echo.icon}
                alt={echo.name}
                size="sm"
                rounded="xl"
                background="accent"
                className="w-16"
              />
              <div className="min-w-0">
                <p className="truncate font-medium">{echo.name}</p>
                <p className="text-xs text-muted-foreground">
                  Costo {echo.cost}
                </p>
              </div>
            </div>

            <EchoLevel slotIndex={slot.index} />
            <EchoMainToggle slotIndex={slot.index} />
          </div>
        )}
      </Show>
    </div>
  )
}

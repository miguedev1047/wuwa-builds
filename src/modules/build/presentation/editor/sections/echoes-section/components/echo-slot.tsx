import type { EchoesDataProps } from "@build/domain/build-record"
import type { EchoProgress } from "@build/presentation/editor/sections/echoes-section/hooks/use-echo-progress"
import { EchoPickerDialog } from "@build/presentation/editor/sections/echoes-section/components/echo-picker-dialog"
import { EchoSlotCard } from "@build/presentation/editor/sections/echoes-section/components/echo-slot-card"
import type { EchoDetail } from "@catalog/domain/echo"
import { BuildCardTrigger } from "@build/presentation/components/build-card-section"
import { useState } from "react"

type EchoSlotProps = {
  slot: EchoesDataProps
  /** Sonata sets of the echo assigned to the slot. */
  sets: EchoDetail["sets"]
  isMain: boolean
  /** Icon of the selected sonata set, resolved by the section content. */
  setIcon?: string
  progress: EchoProgress
}

/** Editable card for one echo slot. */
export function EchoSlot({
  slot,
  sets,
  isMain,
  setIcon,
  progress,
}: EchoSlotProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  if (!slot.data) {
    return (
      <>
        <BuildCardTrigger onClick={() => setPickerOpen(true)}>
          <EchoSlotCard
            slot={slot}
            sets={sets}
            isMain={false}
            setIcon={setIcon}
            progress={progress}
          />
        </BuildCardTrigger>

        <EchoPickerDialog
          slot={slot}
          open={pickerOpen}
          onOpenChange={setPickerOpen}
        />
      </>
    )
  }

  return (
    <EchoSlotCard
      slot={slot}
      sets={sets}
      isMain={isMain}
      setIcon={setIcon}
      progress={progress}
    />
  )
}

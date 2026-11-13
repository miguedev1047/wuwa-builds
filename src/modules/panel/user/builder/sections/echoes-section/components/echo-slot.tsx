import type { EchoesDataProps } from "@builds/domain/build-record"
import type { EchoProgress } from "@builder/sections/echoes-section/application/use-echo-progress"
import { EchoPickerDialog } from "@builder/sections/echoes-section/components/echo-picker-dialog"
import { EchoSlotCard } from "@builder/sections/echoes-section/components/echo-slot-card"
import type { EchoDetail } from "@game-data/domain/echo"
import { BuildCardTrigger } from "@builder/ui/build-card-section"
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

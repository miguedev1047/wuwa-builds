import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { EchoesDataProps } from "@builds/domain/build-record"
import type { EchoProgress } from "@builder/sections/echoes-section/application/use-echo-progress"
import { EchoEditorDialog } from "@builder/sections/echoes-section/components/echo-editor-dialog"
import { EchoPickerDialog } from "@builder/sections/echoes-section/components/echo-picker-dialog"
import type { EchoDetail } from "@game-data/domain/echo"
import {
  ArrowDataTransferHorizontalIcon,
  EllipsisIcon,
  PencilEdit01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type EchoSlotActionsProps = {
  slot: EchoesDataProps
  sets: EchoDetail["sets"]
  isMain: boolean
  progress: EchoProgress
}

/** Actions of one echo slot: edit its config or replace the echo. */
export function EchoSlotActions({
  slot,
  sets,
  isMain,
  progress,
}: EchoSlotActionsProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [editorOpen, setEditorOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={`Acciones del eco ${slot.index + 1}`}
            >
              <HugeiconsIcon icon={EllipsisIcon} />
            </Button>
          }
        />

        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={() => setPickerOpen(true)}>
            <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} />
            Cambiar eco
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEditorOpen(true)}>
            <HugeiconsIcon icon={PencilEdit01Icon} />
            Editar eco
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EchoPickerDialog
        slot={slot}
        open={pickerOpen}
        onOpenChange={setPickerOpen}
      />
      <EchoEditorDialog
        slot={slot}
        sets={sets}
        isMain={isMain}
        progress={progress}
        open={editorOpen}
        onOpenChange={setEditorOpen}
      />
    </>
  )
}

import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { FormOption } from "@/components/form"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { EchoSetAddForm } from "@panel/admin/game-data/views/echoes/detail/sections/sets/components/echo-set-add-form"

type EchoSetAddActionProps = {
  echoId: number
  /** Sets Encore assigns to the echo that are not saved yet. */
  options: FormOption[]
}

export function EchoSetAddAction({ echoId, options }: EchoSetAddActionProps) {
  return (
    <EditableSection.AddAction
      title="Agregar set"
      description="Sets que Encore detecta para este eco."
      disabled={options.length === 0}
      trigger={
        <EditableSection.ButtonAction variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Agregar
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <EchoSetAddForm
          echoId={echoId}
          options={options}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.AddAction>
  )
}

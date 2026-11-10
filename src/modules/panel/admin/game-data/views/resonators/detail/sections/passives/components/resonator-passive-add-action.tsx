import type { EncorePassive } from "@encore/domain/character"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { ResonatorPassiveAddForm } from "@panel/admin/game-data/views/resonators/detail/sections/passives/components/resonator-passive-add-form"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type ResonatorPassiveAddActionProps = {
  resonatorId: number
  sortOrder: number
  isMaxPassives: boolean
  encorePassives: EncorePassive[]
  savedPassiveIds: number[]
}

/** Header action that opens the passive form inside a dialog. */
export function ResonatorPassiveAddAction({
  resonatorId,
  sortOrder,
  isMaxPassives,
  encorePassives,
  savedPassiveIds,
}: ResonatorPassiveAddActionProps) {
  return (
    <EditableSection.AddAction
      disabled={isMaxPassives}
      title="Agregar pasivas"
      description="Elige una o mas pasivas de Encore."
      trigger={
        <EditableSection.ButtonAction variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Agregar
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <ResonatorPassiveAddForm
          resonatorId={resonatorId}
          sortOrder={sortOrder}
          encorePassives={encorePassives}
          savedPassiveIds={savedPassiveIds}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.AddAction>
  )
}

import { Show } from "@/components/utility/show"
import type { WeaponRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { WeaponEditForm } from "@panel/admin/game-data/views/weapons/detail/sections/info/components/weapon-edit-form"
import { useIsMobile } from "@/hooks/use-mobile"

type WeaponEditActionProps = {
  weapon: WeaponRow
}

export function WeaponEditAction({ weapon }: WeaponEditActionProps) {
  const isMobile = useIsMobile()

  return (
    <EditableSection.EditAction
      title="Editar arma"
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant={isMobile ? "icon" : "default"}
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
          <Show when={!isMobile}>Editar</Show>
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <WeaponEditForm weapon={weapon} onSaved={close} onCancel={close} />
      )}
    </EditableSection.EditAction>
  )
}

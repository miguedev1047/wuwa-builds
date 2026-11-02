import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ResonatorSkillRow } from "@/db/schema"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { ResonatorSkillEditForm } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/skills/components/resonator-skill-edit-form"

type ResonatorSkillEditActionProps = {
  skill: ResonatorSkillRow
}

/** Card action that opens the skill edit form inside a dialog. */
export function ResonatorSkillEditAction({
  skill,
}: ResonatorSkillEditActionProps) {
  return (
    <EditableSection.EditAction
      title="Editar habilidad"
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="icon"
          aria-label="Editar habilidad"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <ResonatorSkillEditForm
          skill={skill}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.EditAction>
  )
}

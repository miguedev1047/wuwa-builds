import type { EncoreSkill } from "@encore/domain/character"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { ResonatorSkillAddForm } from "@panel/admin/game-data/views/resonators/detail/sections/skills/components/resonator-skill-add-form"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type ResonatorSkillAddActionProps = {
  resonatorId: number
  sortOrder: number
  isMaxSkills: boolean
  encoreSkills: EncoreSkill[]
  savedSkillIds: number[]
}

/** Header action that opens the skill form inside a dialog. */
export function ResonatorSkillAddAction({
  resonatorId,
  sortOrder,
  isMaxSkills,
  encoreSkills,
  savedSkillIds,
}: ResonatorSkillAddActionProps) {
  return (
    <EditableSection.AddAction
      disabled={isMaxSkills}
      title="Agregar habilidades"
      description="Elige una o mas habilidades de Encore."
      trigger={
        <EditableSection.ButtonAction variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Agregar
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <ResonatorSkillAddForm
          resonatorId={resonatorId}
          sortOrder={sortOrder}
          encoreSkills={encoreSkills}
          savedSkillIds={savedSkillIds}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.AddAction>
  )
}

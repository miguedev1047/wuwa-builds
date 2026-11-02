import type { EncoreSkill } from "@/modules/encore/domain/character"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { ResonatorSkillAddForm } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/skills/components/resonator-skill-add-form"

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

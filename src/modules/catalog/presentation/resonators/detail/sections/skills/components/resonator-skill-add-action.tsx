import { Button } from "@/components/panelui/button"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { useResonatorSkillAddForm } from "@catalog/presentation/resonators/detail/sections/skills/hooks/resonator-skill-add-form"
import type { EncoreSkill } from "@encore/domain/character"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

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
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, options, onCancel } =
    useResonatorSkillAddForm({
      resonatorId: resonatorId,
      sortOrder: sortOrder,
      encoreSkills: encoreSkills,
      savedSkillIds: savedSkillIds,
      onSaved: () => setOpen(false),
      onCancel: () => setOpen(false),
    })
  const onOpenChange = (next: boolean) => {
    if (isPending) return
    if (next) form.reset()
    setOpen(next)
  }
  return (
    <EditableSection.Action
      open={open}
      onOpenChange={onOpenChange}
      isPending={isPending}
      footer={
        <>
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isPending}
          >
            Cerrar
          </Button>

          <form.AppForm>
            <form.Subscribe selector={(state) => state.values.skillIds}>
              {(skillIds) => (
                <form.SubmitButton
                  label="Agregar"
                  formId={formId}
                  disabled={skillIds.length === 0}
                />
              )}
            </form.Subscribe>
          </form.AppForm>
        </>
      }
      mode="default"
      disabled={isMaxSkills}
      title="Agregar habilidades"
      description="Elige una o mas habilidades de Encore."
      trigger={
        <Button variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Agregar
        </Button>
      }
    >
      {() => (
        <form
          id={formId}
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit().catch(() => undefined)
          }}
          className="space-y-4"
        >
          <form.AppField name="skillIds">
            {(field) => (
              <field.MultiComboboxField
                label="Autocompletado inteligente"
                description="Copia las habilidades del resonador en Encore."
                options={options}
                placeholder="Agregar habilidad"
                emptyMessage="Sin habilidades disponibles"
                disabled={isPending}
              />
            )}
          </form.AppField>
        </form>
      )}
    </EditableSection.Action>
  )
}

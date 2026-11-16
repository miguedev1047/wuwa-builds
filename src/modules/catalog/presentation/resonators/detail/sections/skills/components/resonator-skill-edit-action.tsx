import { Button } from "@/components/panelui/button"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorSkillFields } from "@catalog/presentation/resonators/detail/sections/skills/components/resonator-skill-form-fields"
import { useResonatorSkillEditForm } from "@catalog/presentation/resonators/detail/sections/skills/hooks/resonator-skill-edit-form"
import type { ResonatorSkillRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type ResonatorSkillEditActionProps = {
  skill: ResonatorSkillRow
}

/** Card action that opens the skill edit form inside a dialog. */
export function ResonatorSkillEditAction({
  skill,
}: ResonatorSkillEditActionProps) {
  const [open, setOpen] = useState(false)
  const { formId, isPending, form, onCancel } = useResonatorSkillEditForm({
    skill: skill,
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
            <form.SubmitButton label="Guardar" formId={formId} />
          </form.AppForm>
        </>
      }
      mode="edit"
      title="Editar habilidad"
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Editar habilidad"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
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
        >
          <ResonatorSkillFields form={form} isPending={isPending} />
        </form>
      )}
    </EditableSection.Action>
  )
}

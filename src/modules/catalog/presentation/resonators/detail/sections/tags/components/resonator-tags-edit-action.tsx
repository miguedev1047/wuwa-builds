import { Button } from "@/components/panelui/button"
import { Show } from "@/components/utility/show"
import { useIsMobile } from "@/hooks/use-mobile"
import { resonatorTagsSelectionInput } from "@catalog/application/schemas"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { useResonatorTagsForm } from "@catalog/presentation/resonators/detail/sections/tags/hooks/resonator-tags-form"
import type { ResonatorTagRow } from "@db/schema"
import type { EncoreTag } from "@encore/domain/character"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type ResonatorTagsEditActionProps = {
  resonatorId: number
  savedTags: ResonatorTagRow[]
  encoreTags: EncoreTag[]
}

/** Header action that opens the tags form inside a dialog. */
export function ResonatorTagsEditAction({
  resonatorId,
  savedTags,
  encoreTags,
}: ResonatorTagsEditActionProps) {
  const isMobile = useIsMobile()

  const [open, setOpen] = useState(false)
  const { formId, options, isPending, form, onCancel } = useResonatorTagsForm({
    resonatorId: resonatorId,
    savedTags: savedTags,
    encoreTags: encoreTags,
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
      title="Editar etiquetas"
      description="Selecciona los estilos de combate del resonador."
      trigger={
        <Button
          type="button"
          size={isMobile ? "icon" : "md"}
          aria-label="Editar etiquetas"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
          <Show when={!isMobile}>Editar</Show>
        </Button>
      }
    >
      {() => (
        <form
          id={formId}
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault()
            void form.handleSubmit().catch(() => undefined)
          }}
        >
          <form.AppField
            name="tags"
            validators={{ onSubmit: resonatorTagsSelectionInput.shape.tags }}
          >
            {(field) => (
              <field.MultiComboboxField
                label="Etiquetas de rol"
                options={options}
                placeholder="Agregar etiqueta"
                disabled={isPending}
              />
            )}
          </form.AppField>
        </form>
      )}
    </EditableSection.Action>
  )
}

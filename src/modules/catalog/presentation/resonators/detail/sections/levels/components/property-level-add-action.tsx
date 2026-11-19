import { Button } from "@/components/panelui/button"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { PropertyLevelFields } from "@catalog/presentation/resonators/detail/sections/levels/components/property-level-form-fields"
import { usePropertyLevelAddForm } from "@catalog/presentation/resonators/detail/sections/levels/hooks/property-level-add-form"
import type { EncoreProperty } from "@encore/domain/property"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type PropertyLevelAddActionProps = {
  resonatorId: number
  sortOrder: number
  isMaxProperties: boolean
  encoreProperties: EncoreProperty[]
  savedNames: string[]
}

/** Header action that opens the property level form inside a dialog. */
export function PropertyLevelAddAction({
  resonatorId,
  sortOrder,
  encoreProperties,
  isMaxProperties,
  savedNames,
}: PropertyLevelAddActionProps) {
  const [open, setOpen] = useState(false)
  const {
    formId,
    isPending,
    form,
    encoreOptions,
    selectedProperties,
    hasSelection,
    onCancel,
  } = usePropertyLevelAddForm({
    resonatorId: resonatorId,
    sortOrder: sortOrder,
    encoreProperties: encoreProperties,
    savedNames: savedNames,
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
            <form.SubmitButton
              label={
                selectedProperties.length > 1
                  ? "Agregar propiedades"
                  : "Agregar"
              }
              formId={formId}
            />
          </form.AppForm>
        </>
      }
      mode="default"
      disabled={isMaxProperties}
      title="Agregar propiedad"
      description="Elige las propiedades de Encore o escribe sus datos."
      trigger={
        <Button variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Agregar
        </Button>
      }
    >
      {() => (
        <>
          <Show when={encoreOptions.length > 0}>
            <form.AppField name="encoreProperties">
              {(field) => (
                <field.MultiComboboxField
                  label="Autocompletado inteligente"
                  description="Copia los valores base y los iconos del resonador en Encore."
                  options={encoreOptions.map(({ label, value }) => ({
                    label,
                    value,
                  }))}
                  placeholder="Agregar propiedad"
                  emptyMessage="Sin propiedades disponibles"
                  disabled={isPending}
                />
              )}
            </form.AppField>
          </Show>
          <Show when={!hasSelection}>
            <Separator />
          </Show>
          <form
            id={formId}
            onSubmit={(event) => {
              event.preventDefault()
              void form.handleSubmit().catch(() => undefined)
            }}
            className="space-y-4"
          >
            <Show when={!hasSelection}>
              <PropertyLevelFields form={form} isPending={isPending} />
            </Show>
          </form>
        </>
      )}
    </EditableSection.Action>
  )
}

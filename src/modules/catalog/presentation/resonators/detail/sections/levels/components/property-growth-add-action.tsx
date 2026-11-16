import { Button } from "@/components/panelui/button"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { PropertyGrowthFields } from "@catalog/presentation/resonators/detail/sections/levels/components/property-growth-form-fields"
import { usePropertyGrowthAddForm } from "@catalog/presentation/resonators/detail/sections/levels/hooks/property-growth-add-form"
import type { ResonatorPropertyGrowthRow } from "@db/schema"
import type { EncorePropertyGrowth } from "@encore/domain/property"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type PropertyGrowthAddActionProps = {
  propertyId: number
  resonatorId: number
  sortOrder: number
  encoreGrowth: EncorePropertyGrowth[]
  savedGrowth: ResonatorPropertyGrowthRow[]
}

/** Item action that opens the growth form inside a dialog. */
export function PropertyGrowthAddAction({
  propertyId,
  resonatorId,
  sortOrder,
  encoreGrowth,
  savedGrowth,
}: PropertyGrowthAddActionProps) {
  const [open, setOpen] = useState(false)
  const {
    formId,
    isPending,
    form,
    encoreOptions,
    encoreLevels,
    hasSelection,
    onCancel,
  } = usePropertyGrowthAddForm({
      propertyId: propertyId,
      resonatorId: resonatorId,
      sortOrder: sortOrder,
      encoreGrowth: encoreGrowth,
      savedGrowth: savedGrowth,
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
              label={encoreLevels.length > 1 ? "Agregar niveles" : "Agregar"}
              formId={formId}
            />
          </form.AppForm>
        </>
      }
      mode="default"
      title="Agregar nivel"
      description="Elige un nivel de Encore o escribe su valor."
      trigger={
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Agregar nivel"
        >
          <HugeiconsIcon icon={PlusSignIcon} />
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
          <Show when={encoreOptions.length > 0}>
            <form.AppField name="encoreLevels">
              {(field) => (
                <field.MultiComboboxField
                  label="Autocompletado inteligente"
                  description="Copia los niveles y valores del resonador en Encore."
                  options={encoreOptions.map(({ label, value }) => ({
                    label,
                    value,
                  }))}
                  placeholder="Agregar nivel"
                  emptyMessage="Sin niveles disponibles"
                  disabled={isPending}
                />
              )}
            </form.AppField>
          </Show>
          <Show when={!hasSelection}>
            <Separator />
          </Show>
            <Show when={!hasSelection}>
              <PropertyGrowthFields form={form} isPending={isPending} />
            </Show>
        </form>
      )}
    </EditableSection.Action>
  )
}

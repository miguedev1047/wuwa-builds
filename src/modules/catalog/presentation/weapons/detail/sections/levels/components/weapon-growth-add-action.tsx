import { Button } from "@/components/panelui/button"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { WeaponGrowthFields } from "@catalog/presentation/weapons/detail/sections/levels/components/weapon-growth-form-fields"
import { useWeaponGrowthAddForm } from "@catalog/presentation/weapons/detail/sections/levels/hooks/weapon-growth-add-form"
import type { WeaponPropertyGrowthRow } from "@db/schema"
import type { EncorePropertyGrowth } from "@encore/domain/property"
import { PlusSignIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type WeaponGrowthAddActionProps = {
  propertyId: number
  weaponId: number
  sortOrder: number
  encoreGrowth: EncorePropertyGrowth[]
  savedGrowth: WeaponPropertyGrowthRow[]
}

/** Item action that opens the growth form inside a dialog. */
export function WeaponGrowthAddAction({
  propertyId,
  weaponId,
  sortOrder,
  encoreGrowth,
  savedGrowth,
}: WeaponGrowthAddActionProps) {
  const [open, setOpen] = useState(false)
  const {
    formId,
    isPending,
    form,
    encoreOptions,
    encoreLevels,
    hasSelection,
    onCancel,
  } = useWeaponGrowthAddForm({
      propertyId: propertyId,
      weaponId: weaponId,
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
      description="Elige niveles de Encore o escribe su valor."
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
                  description="Copia los niveles y valores del arma en Encore."
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
            <WeaponGrowthFields form={form} isPending={isPending} />
          </Show>
        </form>
      )}
    </EditableSection.Action>
  )
}

import { Button } from "@/components/panelui/button"
import { Field } from "@/components/panelui/field"
import { Select } from "@/components/panelui/select"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import {
  WeaponPropertyFields,
  weaponPropertyFormDefaults,
} from "@catalog/presentation/weapons/detail/sections/levels/components/weapon-property-form-fields"
import { useWeaponPropertyAddForm } from "@catalog/presentation/weapons/detail/sections/levels/hooks/weapon-property-add-form"
import type { EncoreProperty } from "@encore/domain/property"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type WeaponPropertyAddActionProps = {
  weaponId: number
  sortOrder: number
  isMaxProperties: boolean
  encoreProperties: EncoreProperty[]
  savedNames: string[]
}

/** Header action that opens the weapon property form inside a dialog. */
export function WeaponPropertyAddAction({
  weaponId,
  sortOrder,
  encoreProperties,
  isMaxProperties,
  savedNames,
}: WeaponPropertyAddActionProps) {
  const [open, setOpen] = useState(false)
  const {
    encoreFieldId,
    encoreName,
    setEncoreName,
    encoreOptions,
    formId,
    isPending,
    form,
    onCancel,
  } = useWeaponPropertyAddForm({
    weaponId: weaponId,
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
            <form.SubmitButton label="Agregar" formId={formId} />
          </form.AppForm>
        </>
      }
      mode="default"
      disabled={isMaxProperties}
      title="Agregar propiedad"
      description="Elige una propiedad o escribe sus datos."
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
            <Field>
              <Field.Label>Autocompletado inteligente</Field.Label>

              <Select
                items={encoreOptions}
                value={encoreName}
                disabled={isPending}
                onValueChange={(value) => {
                  if (value === null) return

                  const option = encoreOptions.find(
                    (item) => item.value === value
                  )

                  if (!option) return

                  form.reset({
                    ...weaponPropertyFormDefaults,
                    weaponId,
                    sortOrder,
                    ...option.draft,
                  })

                  setEncoreName(null)
                }}
              >
                <Select.Trigger id={encoreFieldId} className="w-full">
                  <Select.Value placeholder="Elegir propiedad de Encore" />
                </Select.Trigger>

                <Select.Content>
                  {encoreOptions.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>

              <Field.Description>
                Copia el valor base y el icono del arma.
              </Field.Description>
            </Field>
          </Show>

          <Separator />

          <form
            id={formId}
            onSubmit={(event) => {
              event.preventDefault()
              void form.handleSubmit().catch(() => undefined)
            }}
            className="space-y-4"
          >
            <WeaponPropertyFields form={form} isPending={isPending} />
          </form>
        </>
      )}
    </EditableSection.Action>
  )
}

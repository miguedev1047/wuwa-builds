import { Button } from "@/components/panelui/button"
import { Field } from "@/components/panelui/field"
import { Select } from "@/components/panelui/select"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import {
  WeaponRefinementFields,
  weaponRefinementFormDefaults,
} from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-form-fields"
import { useWeaponRefinementAddForm } from "@catalog/presentation/weapons/detail/sections/refinements/hooks/weapon-refinement-add-form"
import type { EncoreWeaponRefinement } from "@encore/domain/weapon"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useState } from "react"

type WeaponRefinementAddActionProps = {
  weaponId: number
  sortOrder: number
  isMaxRefinements: boolean
  encoreRefinements: EncoreWeaponRefinement[]
  savedRanks: number[]
}

/** Header action that opens the refinement form inside a dialog. */
export function WeaponRefinementAddAction({
  weaponId,
  sortOrder,
  isMaxRefinements,
  encoreRefinements,
  savedRanks,
}: WeaponRefinementAddActionProps) {
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
  } = useWeaponRefinementAddForm({
    weaponId: weaponId,
    sortOrder: sortOrder,
    encoreRefinements: encoreRefinements,
    savedRanks: savedRanks,
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
      disabled={isMaxRefinements}
      title="Agregar refinamiento"
      description="Elige un rango de Encore o escribe su efecto."
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
                    ...weaponRefinementFormDefaults,
                    weaponId,
                    ...option.draft,
                  })

                  setEncoreName(null)
                }}
              >
                <Select.Trigger id={encoreFieldId} className="w-full">
                  <Select.Value placeholder="Elegir refinamiento de Encore" />
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
                Copia el nombre, el rango y el efecto del arma.
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
            <WeaponRefinementFields form={form} isPending={isPending} />
          </form>
        </>
      )}
    </EditableSection.Action>
  )
}

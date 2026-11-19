import { Button } from "@/components/panelui/button"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { WeaponRefinementFields } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-form-fields"
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
    formId,
    isPending,
    form,
    encoreOptions,
    selectedRefinements,
    hasSelection,
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
            <form.SubmitButton
              label={
                selectedRefinements.length > 1
                  ? "Agregar refinamientos"
                  : "Agregar"
              }
              formId={formId}
            />
          </form.AppForm>
        </>
      }
      mode="default"
      disabled={isMaxRefinements}
      title="Agregar refinamiento"
      description="Elige los rangos de Encore o escribe su efecto."
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
            <form.AppField name="encoreRefinements">
              {(field) => (
                <field.MultiComboboxField
                  label="Autocompletado inteligente"
                  description="Copia el nombre y el efecto de cada rango del arma."
                  options={encoreOptions.map(({ label, value }) => ({
                    label,
                    value,
                  }))}
                  placeholder="Agregar refinamiento"
                  emptyMessage="Sin refinamientos disponibles"
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
              <WeaponRefinementFields form={form} isPending={isPending} />
            </Show>
          </form>
        </>
      )}
    </EditableSection.Action>
  )
}

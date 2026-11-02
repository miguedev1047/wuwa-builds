import { useId } from "react"
import { useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { WeaponPropertyGrowthRow } from "@/db/schema"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import type { EncorePropertyGrowth } from "@/modules/encore/domain/property"
import {
  weaponGrowthMilestoneOptions,
  weaponGrowthPayloads,
  type WeaponGrowthPayload,
} from "@/modules/panel/admin/game-data/application/weapons/property-growth"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { createWeaponPropertyGrowth } from "@/modules/panel/admin/game-data/server/weapons/property-growth"
import {
  WeaponGrowthFields,
  weaponGrowthFormDefaults,
} from "@/modules/panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-growth-form-fields"

type WeaponGrowthAddFormProps = {
  propertyId: number
  weaponId: number
  sortOrder: number
  encoreGrowth: EncorePropertyGrowth[]
  savedGrowth: WeaponPropertyGrowthRow[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of a weapon growth entry, rendered inside the add dialog. */
export function WeaponGrowthAddForm({
  propertyId,
  weaponId,
  sortOrder,
  encoreGrowth,
  savedGrowth,
  onSaved,
  onCancel,
}: WeaponGrowthAddFormProps) {
  const id = useId()
  const formId = `add-weapon-growth-form-${id}`

  const queryClient = useQueryClient()
  const encoreOptions = weaponGrowthMilestoneOptions(encoreGrowth, savedGrowth)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payloads: WeaponGrowthPayload[]) =>
      createWeaponPropertyGrowth({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
      toast.success(
        payloads.length === 1
          ? "Nivel agregado"
          : `${payloads.length} niveles agregados`
      )
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { ...weaponGrowthFormDefaults, propertyId, sortOrder },
    onSubmit: async ({ value }) => {
      await mutateAsync(weaponGrowthPayloads(value, encoreOptions))
    },
  })

  const encoreLevels = useSelector(
    form.store,
    (state) => state.values.encoreLevels
  )
  const hasSelection = encoreLevels.length > 0

  return (
    <>
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

      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="-mx-4 no-scrollbar max-h-[50vh] space-y-4 overflow-y-auto px-4"
      >
        <Show when={!hasSelection}>
          <WeaponGrowthFields form={form} isPending={isPending} />
        </Show>
      </form>

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
          Cerrar
        </Button>

        <form.AppForm>
          <form.SubmitButton
            label={encoreLevels.length > 1 ? "Agregar niveles" : "Agregar"}
            formId={formId}
          />
        </form.AppForm>
      </DialogFooter>
    </>
  )
}

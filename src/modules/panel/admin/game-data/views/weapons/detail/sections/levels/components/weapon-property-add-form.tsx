import { useId, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import type { EncoreProperty } from "@/modules/encore/domain/property"
import {
  weaponPropertyInput,
  type WeaponPropertyInput,
} from "@/modules/panel/admin/game-data/application/schemas"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { createWeaponProperty } from "@/modules/panel/admin/game-data/server/weapons/properties"
import { weaponPropertyDraftFromEncore } from "@/modules/panel/admin/game-data/views/weapons/detail/application/weapon-property-draft"
import {
  WeaponPropertyFields,
  weaponPropertyFormDefaults,
} from "@/modules/panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-property-form-fields"

type WeaponPropertyAddFormProps = {
  weaponId: number
  sortOrder: number
  encoreProperties: EncoreProperty[]
  savedNames: string[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of a weapon property, rendered inside the add dialog. */
export function WeaponPropertyAddForm({
  weaponId,
  sortOrder,
  encoreProperties,
  savedNames,
  onSaved,
  onCancel,
}: WeaponPropertyAddFormProps) {
  const id = useId()
  const formId = `add-weapon-property-form-${id}`
  const encoreFieldId = `add-weapon-property-encore-${id}`

  const [encoreName, setEncoreName] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: WeaponPropertyInput) =>
      createWeaponProperty({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
      toast.success("Propiedad agregada")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { ...weaponPropertyFormDefaults, weaponId, sortOrder },
    validators: { onSubmit: weaponPropertyInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  const encoreOptions = encoreProperties.flatMap((property, index) => {
    const draft = weaponPropertyDraftFromEncore(property)

    if (savedNames.includes(draft.name)) {
      return []
    }

    return [{ label: draft.name, value: String(index), draft }]
  })

  return (
    <>
      <Show when={encoreOptions.length > 0}>
        <Field>
          <FieldLabel htmlFor={encoreFieldId}>
            Autocompletado inteligente
          </FieldLabel>

          <Select
            items={encoreOptions}
            value={encoreName}
            disabled={isPending}
            onValueChange={(value) => {
              if (value === null) return

              const option = encoreOptions.find((item) => item.value === value)

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
            <SelectTrigger id={encoreFieldId} className="w-full">
              <SelectValue placeholder="Elegir propiedad de Encore" />
            </SelectTrigger>

            <SelectContent>
              {encoreOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <FieldDescription>
            Copia el valor base y el icono del arma.
          </FieldDescription>
        </Field>
      </Show>

      <Separator />

      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="-mx-4 no-scrollbar max-h-[50vh] space-y-4 overflow-y-auto px-4"
      >
        <WeaponPropertyFields form={form} isPending={isPending} />
      </form>

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
          Cerrar
        </Button>

        <form.AppForm>
          <form.SubmitButton label="Agregar" formId={formId} />
        </form.AppForm>
      </DialogFooter>
    </>
  )
}

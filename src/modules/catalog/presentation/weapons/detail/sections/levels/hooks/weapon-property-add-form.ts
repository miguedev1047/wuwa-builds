import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import type { WeaponPropertyInput } from "@catalog/application/schemas"
import {
  weaponPropertyOptions,
  weaponPropertyPayloads,
} from "@catalog/presentation/weapons/detail/application/weapon-property-draft"
import { weaponPropertyFormDefaults } from "@catalog/presentation/weapons/detail/sections/levels/components/weapon-property-form-fields"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createWeaponProperties } from "@catalog/server/weapons/properties"
import type { EncoreProperty } from "@encore/domain/property"
import { useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type WeaponPropertyAddFormProps = {
  weaponId: number
  sortOrder: number
  encoreProperties: EncoreProperty[]
  savedNames: string[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of weapon properties, rendered inside the add dialog. */
export function useWeaponPropertyAddForm({
  weaponId,
  sortOrder,
  encoreProperties,
  savedNames,
  onSaved,
  onCancel,
}: WeaponPropertyAddFormProps) {
  const toast = useToast()

  const id = useId()
  const formId = `add-weapon-property-form-${id}`

  const queryClient = useQueryClient()
  const encoreOptions = weaponPropertyOptions(encoreProperties, savedNames)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payloads: WeaponPropertyInput[]) =>
      createWeaponProperties({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
      toast.add({
        title:
          payloads.length === 1
            ? "Propiedad agregada"
            : `${payloads.length} propiedades agregadas`,
        type: "success",
      })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { ...weaponPropertyFormDefaults, weaponId, sortOrder },
    onSubmit: async ({ value }) => {
      await mutateAsync(weaponPropertyPayloads(value, encoreOptions))
    },
  })

  const selectedProperties = useSelector(
    form.store,
    (state) => state.values.encoreProperties
  )
  const hasSelection = selectedProperties.length > 0

  return {
    formId,
    isPending,
    form,
    encoreOptions,
    selectedProperties,
    hasSelection,
    onCancel,
  }
}

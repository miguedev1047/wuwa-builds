import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  weaponPropertyInput,
  type WeaponPropertyInput,
} from "@catalog/application/schemas"
import { statLabel } from "@catalog/application/stats/stats"
import { weaponPropertyDraftFromEncore } from "@catalog/presentation/weapons/detail/application/weapon-property-draft"
import { weaponPropertyFormDefaults } from "@catalog/presentation/weapons/detail/sections/levels/components/weapon-property-form-fields"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createWeaponProperty } from "@catalog/server/weapons/properties"
import type { EncoreProperty } from "@encore/domain/property"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId, useState } from "react"

type WeaponPropertyAddFormProps = {
  weaponId: number
  sortOrder: number
  encoreProperties: EncoreProperty[]
  savedNames: string[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of a weapon property, rendered inside the add dialog. */
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
      toast.add({ title: "Propiedad agregada", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
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

    return [{ label: statLabel(draft.name), value: String(index), draft }]
  })

  return {
    encoreFieldId,
    encoreName,
    setEncoreName,
    encoreOptions,
    formId,
    isPending,
    form,
    onCancel,
  }
}

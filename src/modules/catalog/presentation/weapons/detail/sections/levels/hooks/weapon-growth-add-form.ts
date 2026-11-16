import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  weaponGrowthMilestoneOptions,
  weaponGrowthPayloads,
  type WeaponGrowthPayload,
} from "@catalog/application/weapons/property-growth"
import { weaponGrowthFormDefaults } from "@catalog/presentation/weapons/detail/sections/levels/components/weapon-growth-form-fields"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createWeaponPropertyGrowth } from "@catalog/server/weapons/property-growth"
import type { WeaponPropertyGrowthRow } from "@db/schema"
import type { EncorePropertyGrowth } from "@encore/domain/property"
import { useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

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
export function useWeaponGrowthAddForm({
  propertyId,
  weaponId,
  sortOrder,
  encoreGrowth,
  savedGrowth,
  onSaved,
  onCancel,
}: WeaponGrowthAddFormProps) {
  const toast = useToast()

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
      toast.add({
        title:
          payloads.length === 1
            ? "Nivel agregado"
            : `${payloads.length} niveles agregados`,
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

  return {
    id,
    formId,
    isPending,
    form,
    encoreOptions,
    encoreLevels,
    hasSelection,
    onCancel,
  }
}

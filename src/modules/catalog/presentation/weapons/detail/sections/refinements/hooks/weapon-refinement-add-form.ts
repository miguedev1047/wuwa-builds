import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import type { WeaponRefinementInput } from "@catalog/application/schemas"
import {
  weaponRefinementOptions,
  weaponRefinementPayloads,
} from "@catalog/presentation/weapons/detail/application/weapon-refinement-draft"
import { weaponRefinementFormDefaults } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-form-fields"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createWeaponRefinements } from "@catalog/server/weapons/refinements"
import type { EncoreWeaponRefinement } from "@encore/domain/weapon"
import { useSelector } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type WeaponRefinementAddFormProps = {
  weaponId: number
  sortOrder: number
  encoreRefinements: EncoreWeaponRefinement[]
  savedRanks: number[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of weapon refinements, rendered inside the add dialog. */
export function useWeaponRefinementAddForm({
  weaponId,
  sortOrder,
  encoreRefinements,
  savedRanks,
  onSaved,
  onCancel,
}: WeaponRefinementAddFormProps) {
  const toast = useToast()

  const id = useId()
  const formId = `add-weapon-refinement-form-${id}`

  const queryClient = useQueryClient()
  const encoreOptions = weaponRefinementOptions(encoreRefinements, savedRanks)

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payloads: WeaponRefinementInput[]) =>
      createWeaponRefinements({ data: payloads }),
    onSuccess: async (_created, payloads) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
      toast.add({
        title:
          payloads.length === 1
            ? "Refinamiento creado"
            : `${payloads.length} refinamientos creados`,
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
    defaultValues: { ...weaponRefinementFormDefaults, weaponId, sortOrder },
    onSubmit: async ({ value }) => {
      await mutateAsync(weaponRefinementPayloads(value, encoreOptions))
    },
  })

  const selectedRefinements = useSelector(
    form.store,
    (state) => state.values.encoreRefinements ?? []
  )
  const hasSelection = selectedRefinements.length > 0

  return {
    formId,
    isPending,
    form,
    encoreOptions,
    selectedRefinements,
    hasSelection,
    onCancel,
  }
}

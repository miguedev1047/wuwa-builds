import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  weaponRefinementFormInput,
  type WeaponRefinementInput,
} from "@catalog/application/schemas"
import { weaponRefinementDraftFromEncore } from "@catalog/presentation/weapons/detail/application/weapon-refinement-draft"
import { weaponRefinementFormDefaults } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-form-fields"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { createWeaponRefinement } from "@catalog/server/weapons/refinements"
import type { EncoreWeaponRefinement } from "@encore/domain/weapon"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId, useState } from "react"

type WeaponRefinementAddFormProps = {
  weaponId: number
  sortOrder: number
  encoreRefinements: EncoreWeaponRefinement[]
  savedRanks: number[]
  onSaved: () => void
  onCancel: () => void
}

/** Create form of a weapon refinement, rendered inside the add dialog. */
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
  const encoreFieldId = `add-weapon-refinement-encore-${id}`

  const [encoreName, setEncoreName] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: WeaponRefinementInput) =>
      createWeaponRefinement({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(weaponId),
      })
      toast.add({ title: "Refinamiento creado", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { ...weaponRefinementFormDefaults, weaponId, sortOrder },
    validators: { onSubmit: weaponRefinementFormInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  const encoreOptions = encoreRefinements.flatMap((refinement) => {
    if (savedRanks.includes(refinement.rank)) return []

    return [
      {
        label: `Refinamiento ${refinement.rank} — ${refinement.name}`,
        value: String(refinement.rank),
        draft: weaponRefinementDraftFromEncore(refinement),
      },
    ]
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

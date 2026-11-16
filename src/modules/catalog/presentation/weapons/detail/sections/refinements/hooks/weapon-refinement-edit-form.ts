import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import {
  weaponRefinementUpdateInput,
  type WeaponRefinementUpdateInput,
} from "@catalog/application/schemas"
import { weaponRefinementDraftFromRow } from "@catalog/presentation/weapons/detail/application/weapon-refinement-draft"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { updateWeaponRefinement } from "@catalog/server/weapons/refinements"
import type { WeaponRefinementRow } from "@db/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type WeaponRefinementEditFormProps = {
  refinement: WeaponRefinementRow
  onSaved: () => void
  onCancel: () => void
}

/** Edit form of a weapon refinement, rendered inside the edit dialog. */
export function useWeaponRefinementEditForm({
  refinement,
  onSaved,
  onCancel,
}: WeaponRefinementEditFormProps) {
  const toast = useToast()

  const formId = `edit-weapon-refinement-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: WeaponRefinementUpdateInput) =>
      updateWeaponRefinement({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(refinement.weaponId),
      })
      toast.add({ title: "Refinamiento actualizado", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: weaponRefinementDraftFromRow(refinement),
    validators: { onSubmit: weaponRefinementUpdateInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return { formId, isPending, form, onCancel }
}

import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import { weaponInput, type WeaponInput } from "@catalog/application/schemas"
import { weaponDraftFromRow } from "@catalog/application/weapons/weapon-draft"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { updateWeapon } from "@catalog/server/weapons/weapons"
import type { WeaponRow } from "@db/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type WeaponEditFormProps = {
  weapon: WeaponRow
  onSaved: () => void
  onCancel: () => void
}

export function useWeaponEditForm({
  weapon,
  onSaved,
  onCancel,
}: WeaponEditFormProps) {
  const toast = useToast()

  const formId = `edit-weapon-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: WeaponInput) => updateWeapon({ data: value }),
    onSuccess: async (updated) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.weapons(),
        }),
        queryClient.invalidateQueries({
          queryKey: wuwaBuildsKeys.weapon(updated.id),
        }),
      ])
      toast.add({ title: "Arma actualizada", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: weaponDraftFromRow(weapon),
    validators: { onSubmit: weaponInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value)
    },
  })

  return { formId, isPending, form, onCancel }
}

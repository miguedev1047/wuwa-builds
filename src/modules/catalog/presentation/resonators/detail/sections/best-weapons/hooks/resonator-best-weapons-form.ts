import { useAppForm } from "@/components/form"
import { useToast } from "@/components/panelui/toast"
import { resonatorBestWeaponsSelectionInput } from "@catalog/application/schemas"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { replaceResonatorBestWeapons } from "@catalog/server/resonators/best-weapons"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useId } from "react"

type ResonatorBestWeaponsFormProps = {
  resonatorId: number
  weaponIds: string[]
  onSaved: () => void
  onCancel: () => void
}

/** Full replacement form for the resonator weapon ranking. */
export function useResonatorBestWeaponsForm({
  resonatorId,
  weaponIds,
  onSaved,
  onCancel,
}: ResonatorBestWeaponsFormProps) {
  const toast = useToast()
  const formId = `resonator-best-weapons-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (selectedWeaponIds: string[]) =>
      replaceResonatorBestWeapons({
        data: {
          resonatorId,
          weapons: selectedWeaponIds.map((weaponId) => ({
            weaponId: Number(weaponId),
          })),
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
      toast.add({ title: "Armas recomendadas guardadas", type: "success" })
      onSaved()
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const form = useAppForm({
    formId,
    defaultValues: { weaponIds },
    validators: { onSubmit: resonatorBestWeaponsSelectionInput },
    onSubmit: async ({ value }) => {
      await mutateAsync(value.weaponIds)
    },
  })

  return { formId, isPending, form, onCancel }
}

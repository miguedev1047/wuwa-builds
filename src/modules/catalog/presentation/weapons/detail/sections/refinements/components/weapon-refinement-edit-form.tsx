import { useId } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useAppForm } from "@/components/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import type { WeaponRefinementRow } from "@db/schema"
import {
  weaponRefinementUpdateInput,
  type WeaponRefinementUpdateInput,
} from "@catalog/application/schemas"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { updateWeaponRefinement } from "@catalog/server/weapons/refinements"
import { weaponRefinementDraftFromRow } from "@catalog/presentation/weapons/detail/application/weapon-refinement-draft"
import { WeaponRefinementFields } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-form-fields"

type WeaponRefinementEditFormProps = {
  refinement: WeaponRefinementRow
  onSaved: () => void
  onCancel: () => void
}

/** Edit form of a weapon refinement, rendered inside the edit dialog. */
export function WeaponRefinementEditForm({
  refinement,
  onSaved,
  onCancel,
}: WeaponRefinementEditFormProps) {
  const formId = `edit-weapon-refinement-form-${useId()}`
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (value: WeaponRefinementUpdateInput) =>
      updateWeaponRefinement({ data: value }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.weapon(refinement.weaponId),
      })
      toast.success("Refinamiento actualizado")
      onSaved()
    },
    onError: (error) => {
      toast.error(error.message)
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

  return (
    <>
      <form
        id={formId}
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4"
      >
        <WeaponRefinementFields form={form} isPending={isPending} />
      </form>

      <DialogFooter>
        <Button type="button" size="xl" variant="secondary" onClick={onCancel}>
          Cerrar
        </Button>

        <form.AppForm>
          <form.SubmitButton label="Guardar" formId={formId} />
        </form.AppForm>
      </DialogFooter>
    </>
  )
}

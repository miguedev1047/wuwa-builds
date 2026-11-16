import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteEchoSkillBonus } from "@catalog/server/echoes/skills"
import type { EchoSkillBonusRow } from "@db/schema"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type EchoSkillBonusDeleteActionProps = {
  echoId: number
  bonus: EchoSkillBonusRow
}

export function EchoSkillBonusDeleteAction({
  echoId,
  bonus,
}: EchoSkillBonusDeleteActionProps) {
  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteEchoSkillBonus({ data: { id: bonus.id } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.echo(echoId),
      })
      toast.add({ title: "Bono eliminado", type: "success" })
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const handleRemove = () => {
    if (!isValidId(bonus.id)) return

    return mutateAsync()
  }

  return (
    <EditableSection.Action
      mode="destructive"
      title="Eliminar bono"
      description="Estas seguro que quieres eliminar este bono"
      isPending={isPending}
      onConfirm={handleRemove}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label="Eliminar bono"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}

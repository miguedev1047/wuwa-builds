import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import type { EchoSkillBonusRow } from "@/db/schema"
import { isValidId } from "@/modules/panel/admin/game-data/application/id"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { deleteEchoSkillBonus } from "@/modules/panel/admin/game-data/server/echoes/skills"

type EchoSkillBonusDeleteActionProps = {
  echoId: number
  bonus: EchoSkillBonusRow
}

export function EchoSkillBonusDeleteAction({
  echoId,
  bonus,
}: EchoSkillBonusDeleteActionProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteEchoSkillBonus({ data: { id: bonus.id } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.echo(echoId),
      })
      toast.success("Bono eliminado")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemove = () => {
    if (!isValidId(bonus.id)) return

    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Eliminar bono"
      description="Estas seguro que quieres eliminar este bono"
      isPending={isPending}
      onConfirm={handleRemove}
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="destructive"
          aria-label="Eliminar bono"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </EditableSection.ButtonAction>
      }
    />
  )
}

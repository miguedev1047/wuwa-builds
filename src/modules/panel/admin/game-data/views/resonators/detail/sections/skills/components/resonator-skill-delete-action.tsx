import { useMutation, useQueryClient } from "@tanstack/react-query"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { isValidId } from "@/modules/panel/admin/game-data/application/id"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@/modules/panel/admin/game-data/queries/keys"
import { deleteResonatorSkill } from "@/modules/panel/admin/game-data/server/skills"

type ResonatorSkillDeleteActionProps = {
  skillId: number
  resonatorId: number
}

/** Removes one skill from the resonator after confirmation. */
export function ResonatorSkillDeleteAction({
  skillId,
  resonatorId,
}: ResonatorSkillDeleteActionProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteResonatorSkill({ data: { id: skillId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
    },
    onSuccess: () => {
      toast.success("Habilidad eliminada")
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const handleRemoveSkill = () => {
    if (!isValidId(skillId)) return

    mutate()
  }

  return (
    <EditableSection.DeleteAction
      title="Eliminar habilidad"
      description="Estas seguro que quieres eliminar esta habilidad? Esta accion es irreversible."
      isPending={isPending}
      onConfirm={handleRemoveSkill}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          aria-label="Eliminar habilidad"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}

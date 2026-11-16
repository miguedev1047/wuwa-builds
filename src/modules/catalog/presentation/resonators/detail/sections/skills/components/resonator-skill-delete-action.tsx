import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { isValidId } from "@catalog/application/id"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { deleteResonatorSkill } from "@catalog/server/resonators/skills"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type ResonatorSkillDeleteActionProps = {
  skillId: number
  resonatorId: number
}

/** Removes one skill from the resonator after confirmation. */
export function ResonatorSkillDeleteAction({
  skillId,
  resonatorId,
}: ResonatorSkillDeleteActionProps) {
  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => deleteResonatorSkill({ data: { id: skillId } }),
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })
    },
    onSuccess: () => {
      toast.add({ title: "Habilidad eliminada", type: "success" })
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  const handleRemoveSkill = () => {
    if (!isValidId(skillId)) return

    return mutateAsync()
  }

  return (
    <EditableSection.Action
      mode="destructive"
      title="Eliminar habilidad"
      description="Estas seguro que quieres eliminar esta habilidad? Esta accion es irreversible."
      isPending={isPending}
      onConfirm={handleRemoveSkill}
      trigger={
        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label="Eliminar habilidad"
          disabled={isPending}
        >
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      }
    />
  )
}

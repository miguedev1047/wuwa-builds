import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CloudSyncIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { syncResonatorSequenceIcons } from "@catalog/server/resonators/sequences"

type ResonatorSequenceSyncActionProps = {
  resonatorId: number
}

/** Fills the icons Encore publishes for the already saved sequences. */
export function ResonatorSequenceSyncAction({
  resonatorId,
}: ResonatorSequenceSyncActionProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => syncResonatorSequenceIcons({ data: { id: resonatorId } }),
    onSuccess: async ({ updated }) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })

      toast.success(
        updated === 0
          ? "Las secuencias ya tienen su icono"
          : `${updated} iconos actualizados`
      )
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <EditableSection.ButtonAction
      type="button"
      variant="icon"
      aria-label="Sincronizar iconos de secuencias"
      aria-busy={isPending}
      disabled={isPending}
      onClick={() => mutate()}
    >
      <HugeiconsIcon icon={CloudSyncIcon} />
    </EditableSection.ButtonAction>
  )
}

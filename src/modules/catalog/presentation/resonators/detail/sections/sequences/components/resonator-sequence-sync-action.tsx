import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { syncResonatorSequenceIcons } from "@catalog/server/resonators/sequences"
import { CloudSyncIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type ResonatorSequenceSyncActionProps = {
  resonatorId: number
}

/** Fills the icons Encore publishes for the already saved sequences. */
export function ResonatorSequenceSyncAction({
  resonatorId,
}: ResonatorSequenceSyncActionProps) {
  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => syncResonatorSequenceIcons({ data: { id: resonatorId } }),
    onSuccess: async ({ updated }) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.character(resonatorId),
      })

      toast.add({
        title:
          updated === 0
            ? "Las secuencias ya tienen su icono"
            : `${updated} iconos actualizados`,
        type: "success",
      })
    },
    onError: (error) => {
      toast.add({ title: error.message, type: "destructive" })
    },
  })

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Sincronizar iconos de secuencias"
      aria-busy={isPending}
      disabled={isPending}
      onClick={() => mutate()}
    >
      <HugeiconsIcon icon={CloudSyncIcon} />
    </Button>
  )
}

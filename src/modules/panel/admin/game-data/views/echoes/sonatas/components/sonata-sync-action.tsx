import { useMutation, useQueryClient } from "@tanstack/react-query"
import { CloudSyncIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { toast } from "sonner"
import { Show } from "@/components/utility/show"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { wuwaBuildsKeys } from "@/modules/game-data/queries/keys"
import { syncSonatas } from "@/modules/game-data/server/echoes/sonatas"

/**
 * Imports the sonata sets Encore publishes.
 *
 * Manual sets are reported separately because the sync never touches them.
 */
export function SonataSyncAction() {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => syncSonatas(),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.sonatas(),
      })
      toast.success(
        `Encore: ${result.created} nuevos, ${result.updated} actualizados, ${result.skipped} manuales`
      )
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <EditableSection.ButtonAction
      type="button"
      variant="default"
      disabled={isPending}
      onClick={() => mutate()}
    >
      <HugeiconsIcon icon={CloudSyncIcon} />
      <Show when={isPending} fallback="Sincronizar">
        Sincronizando
      </Show>
    </EditableSection.ButtonAction>
  )
}

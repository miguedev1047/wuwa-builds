import { Button } from "@/components/panelui/button"
import { useToast } from "@/components/panelui/toast"
import { Show } from "@/components/utility/show"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { syncSonatas } from "@catalog/server/echoes/sonatas"
import { CloudSyncIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

/**
 * Imports the sonata sets Encore publishes.
 *
 * Manual sets are reported separately because the sync never touches them.
 */
export function SonataSyncAction() {
  const toast = useToast()

  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: () => syncSonatas(),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({
        queryKey: wuwaBuildsKeys.sonatas(),
      })
      toast.add({
        title: `Encore: ${result.created} nuevos, ${result.updated} actualizados, ${result.skipped} manuales`,
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
      variant="default"
      disabled={isPending}
      onClick={() => mutate()}
    >
      <HugeiconsIcon icon={CloudSyncIcon} />
      <Show when={isPending} fallback="Sincronizar">
        Sincronizando
      </Show>
    </Button>
  )
}

import { useToast } from "@/components/panelui/toast"
import { wuwaBuildsKeys } from "@catalog/queries/keys"
import { syncSonatas } from "@catalog/server/echoes/sonatas"
import { useMutation, useQueryClient } from "@tanstack/react-query"

/**
 * Imports the sonata sets Encore publishes.
 *
 * Manual sets are reported separately because the sync never touches them.
 */
export function useSonataSync() {
  const toast = useToast()

  const queryClient = useQueryClient()

  return useMutation({
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
}

import { useQueryClient } from "@tanstack/react-query"
import { selectEchoSlot } from "@builds/application/select-echo-slot"
import { updateBuild } from "@builds/client/build-store"
import type { EchoSummary } from "@game-data/domain/echo"
import { echoQueries } from "@game-data/queries/echoes"

/** Assigns an echo to a slot and warms its detail query. */
export function useSelectEcho(buildId: string) {
  const queryClient = useQueryClient()

  const selectEcho = (targetIndex: number, echo: EchoSummary) => {
    updateBuild(buildId, (draft) => {
      draft.echoes = selectEchoSlot({
        echoes: draft.echoes,
        targetIndex,
        echo,
      })
      draft.updateAt = new Date().toISOString()
    })

    void queryClient.prefetchQuery(echoQueries.detail(echo.id))
  }

  return { selectEcho }
}

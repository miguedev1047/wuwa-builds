import { buildEdits } from "@builds/application/build-edits"
import { useSessionId } from "@panel/user/builds/application/build-live-queries"
import { useQueryClient } from "@tanstack/react-query"
import { updateBuild } from "@builds/client/build-store"
import type { EchoSummary } from "@game-data/domain/echo"
import { echoQueries } from "@game-data/queries/echoes"

/** Assigns an echo to a slot and warms its detail query. */
export function useSelectEcho(buildId: string) {
  const queryClient = useQueryClient()
  const identity = { buildId, sessionId: useSessionId() }

  const selectEcho = (targetIndex: number, echo: EchoSummary) => {
    const updated = updateBuild(identity, (draft) =>
      buildEdits.selectEcho(draft, targetIndex, echo)
    )
    if (!updated) return

    void queryClient.query(echoQueries.detail(echo.id))
  }

  return { selectEcho }
}

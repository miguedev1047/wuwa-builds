import { buildEdits } from "@build/application/build-edits"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { useQueryClient } from "@tanstack/react-query"
import { updateBuild } from "@build/client/build-store"
import type { EchoSummary } from "@catalog/domain/echo"
import { echoQueries } from "@catalog/queries/echoes"

/** Assigns an echo to a slot and warms its detail query. */
export function useSelectEcho(buildId: string) {
  const queryClient = useQueryClient()
  const identity = { buildId, sessionId: useBuildIdentity().sessionId }

  const selectEcho = (targetIndex: number, echo: EchoSummary) => {
    const updated = updateBuild(identity, (draft) =>
      buildEdits.selectEcho(draft, targetIndex, echo)
    )
    if (!updated) return

    void queryClient.query(echoQueries.detail(echo.id))
  }

  return { selectEcho }
}

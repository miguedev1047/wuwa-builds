import { buildEdits } from "@build/application/build-edits"
import { useBuildStore } from "@build/client/hooks/use-build-store"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { useQueryClient } from "@tanstack/react-query"
import type { EchoSummary } from "@catalog/domain/echo"
import { echoQueries } from "@catalog/queries/echoes"

/** Assigns an echo to a slot and warms its detail query. */
export function useSelectEcho() {
  const { buildId, userId } = useBuildIdentity()
  const { update } = useBuildStore(userId)
  const queryClient = useQueryClient()
  const identity = { buildId, userId }

  const selectEcho = (targetIndex: number, echo: EchoSummary) => {
    const updated = update(identity, (draft) =>
      buildEdits.selectEcho(draft, targetIndex, echo)
    )
    if (!updated) return false

    void queryClient.query(echoQueries.detail(echo.id)).catch(() => undefined)
    return true
  }

  return { selectEcho }
}

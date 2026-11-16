import { useToast } from "@/components/panelui/toast"
import { createEmptyBuild } from "@build/application/factories/build"
import { countSessionBuilds, insertBuild } from "@build/client/build-store"
import { useSessionBuildCount } from "@build/client/hooks/build-live-queries"
import { MAX_LOCAL_BUILDS } from "@build/domain/build"

/** Creates an empty local build and opens its editor. */
export function useCreateBuild(
  sessionId: string,
  onCreated: (buildId: string) => void
) {
  const toast = useToast()
  const buildCount = useSessionBuildCount(sessionId)

  const createBuild = () => {
    if (countSessionBuilds(sessionId) >= MAX_LOCAL_BUILDS) {
      toast.add({ title: "Límite de builds alcanzado", type: "error" })
      return
    }

    const buildId = crypto.randomUUID()
    const now = new Date().toISOString()

    insertBuild(
      createEmptyBuild({
        buildId,
        sessionId: sessionId,
        createdAt: now,
      })
    )

    onCreated(buildId)
  }

  return { buildCount, createBuild }
}

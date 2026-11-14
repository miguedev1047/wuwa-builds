import { toast } from "sonner"
import { createEmptyBuild } from "@build/application/factories/build"
import { countSessionBuilds, insertBuild } from "@build/client/build-store"
import { MAX_LOCAL_BUILDS } from "@build/domain/build"
import { useSessionBuildCount } from "@build/client/hooks/build-live-queries"

/** Creates an empty local build and opens its editor. */
export function useCreateBuild(
  sessionId: string,
  onCreated: (buildId: string) => void
) {
  const buildCount = useSessionBuildCount(sessionId)

  const createBuild = () => {
    if (countSessionBuilds(sessionId) >= MAX_LOCAL_BUILDS) {
      toast.error("Límite de builds alcanzado", {
        description: `Solo puedes tener ${MAX_LOCAL_BUILDS} builds locales.`,
      })
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

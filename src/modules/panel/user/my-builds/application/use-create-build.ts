import { useNavigate, useRouteContext } from "@tanstack/react-router"
import { toast } from "sonner"
import { createEmptyBuild } from "@builds/application/factories/build"
import { countSessionBuilds, insertBuild } from "@builds/client/build-store"
import { MAX_LOCAL_BUILDS } from "@builds/domain/build"
import { useSessionBuildCount } from "@panel/user/builds/application/build-live-queries"

/** Creates an empty local build and opens its editor. */
export function useCreateBuild() {
  const { session } = useRouteContext({ from: "/(panel)/panel" })
  const navigate = useNavigate()
  const buildCount = useSessionBuildCount()

  const createBuild = () => {
    if (countSessionBuilds(session.session.id) >= MAX_LOCAL_BUILDS) {
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
        sessionId: session.session.id,
        createdAt: now,
      })
    )

    void navigate({
      to: "/panel/builder/$buildId",
      params: { buildId },
    })
  }

  return { buildCount, createBuild }
}

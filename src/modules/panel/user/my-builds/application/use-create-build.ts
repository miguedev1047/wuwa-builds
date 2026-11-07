import { useNavigate, useRouteContext } from "@tanstack/react-router"
import { createEmptyBuild } from "@/modules/builds/application/factories/build"
import { insertBuild } from "@/modules/builds/client/build-store"

/** Creates an empty local build and opens its editor. */
export function useCreateBuild() {
  const { session } = useRouteContext({ from: "/(panel)/panel" })
  const navigate = useNavigate()

  const createBuild = () => {
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

  return { createBuild }
}

import { useToast } from "@/components/panelui/toast"
import { createEmptyBuild } from "@build/application/factories/build"
import { countUserBuilds, insertBuild } from "@build/client/build-store"
import { useUserBuildCount } from "@build/client/hooks/build-live-queries"
import { MAX_LOCAL_BUILDS } from "@build/domain/build"

/** Creates an empty local build and opens its editor. */
export function useCreateBuild(
  userId: string,
  onCreated: (buildId: string) => void
) {
  const toast = useToast()
  const buildCount = useUserBuildCount(userId)

  const createBuild = () => {
    if (countUserBuilds(userId) >= MAX_LOCAL_BUILDS) {
      toast.add({ title: "Límite de builds alcanzado", type: "error" })
      return
    }

    const buildId = crypto.randomUUID()
    const now = new Date().toISOString()

    insertBuild(
      createEmptyBuild({
        buildId,
        userId: userId,
        createdAt: now,
      })
    )

    onCreated(buildId)
  }

  return { buildCount, createBuild }
}

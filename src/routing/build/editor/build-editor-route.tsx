import { useBuildCollection } from "@build/client/hooks/build-live-queries"
import { useBuildActions } from "@build/presentation/editor/hooks/use-build-actions"
import {
  BuildRouteNotFound,
  BuildRoutePending,
} from "@/routing/build/route-state"
import { BuilderEditorPage } from "@/routing/build/editor/builder-editor-page"
import { useNavigate } from "@tanstack/react-router"
import { Suspense } from "react"

type BuildEditorRouteProps = {
  buildId: string
  userId: string
}

/** Editor screen and its loading boundary. */
export function BuildEditorRoute({ buildId, userId }: BuildEditorRouteProps) {
  return (
    <Suspense fallback={<BuildRoutePending />}>
      <BuildEditorContent buildId={buildId} userId={userId} />
    </Suspense>
  )
}

function BuildEditorContent({ buildId, userId }: BuildEditorRouteProps) {
  const navigate = useNavigate()
  const { data: liveBuild } = useBuildCollection({ buildId, userId })

  const { build, renameBuild, deleteBuild } = useBuildActions({
    userId,
    editor: { buildId, liveBuild },
  })

  if (!build) return <BuildRouteNotFound />

  return (
    <BuilderEditorPage
      buildId={buildId}
      build={build}
      remove={() => deleteBuild(() => navigate({ to: "/panel/my-builds" }))}
      rename={renameBuild}
      userId={userId}
    />
  )
}

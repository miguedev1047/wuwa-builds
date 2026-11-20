import { buildCollection } from "@build/client/build-store"
import { useBuildCollection } from "@build/client/hooks/build-live-queries"
import { useBuildActions } from "@build/presentation/editor/hooks/use-build-actions"
import {
  BuildRouteError,
  BuildRouteNotFound,
  BuildRoutePending,
} from "@/routing/build/route-state"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { BuilderEditorPage } from "@/routing/build/editor/builder-editor-page"

export const Route = createFileRoute("/panel/builder/$buildId/")({
  component: RouteComponent,
  pendingComponent: BuildRoutePending,
  errorComponent: BuildRouteError,
  notFoundComponent: BuildRouteNotFound,
  ssr: false,
  loader: async () => {
    await buildCollection.preload()
  },
})

/** Editor route: binds the loaded build to the rename and delete actions. */
function RouteComponent() {
  const navigate = useNavigate()

  const { buildId } = Route.useParams()
  const { userId } = Route.useRouteContext()

  const { data: liveBuild } = useBuildCollection({ buildId, userId })

  const { build, rename, remove } = useBuildActions({
    liveBuild,
    buildId,
    onDeleted: () => navigate({ to: "/panel/my-builds" }),
  })

  if (!build) return <BuildRouteNotFound />

  return (
    <BuilderEditorPage
      buildId={buildId}
      build={build}
      remove={remove}
      rename={rename}
      userId={userId}
    />
  )
}

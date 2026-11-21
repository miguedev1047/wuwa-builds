import { BuildEditorRoute } from "@/routing/build/editor/build-editor-route"
import {
  BuildRouteError,
  BuildRouteNotFound,
  BuildRoutePending,
} from "@/routing/build/route-state"
import { createFileRoute } from "@tanstack/react-router"
import { buildsCollection } from "@build/client/builds-collection"

export const Route = createFileRoute("/panel/builder/$buildId/")({
  component: RouteComponent,
  pendingComponent: BuildRoutePending,
  errorComponent: BuildRouteError,
  notFoundComponent: BuildRouteNotFound,
  loader: ({ context: { dbClient, userId } }) =>
    dbClient.collection(buildsCollection(userId)).preload(),
})

/** Editor route: binds the build id and the signed-in user. */
function RouteComponent() {
  const { buildId } = Route.useParams()
  const { userId } = Route.useRouteContext()

  return <BuildEditorRoute buildId={buildId} userId={userId} />
}

import { MyBuildsRoute } from "@/routing/build/my-builds/my-builds-route"
import {
  MyBuildsRouteError,
  MyBuildsRouteNotFound,
  MyBuildsRoutePending,
} from "@/routing/build/my-builds-route-state"
import { createFileRoute } from "@tanstack/react-router"
import { buildsCollection } from "@build/client/builds-collection"

export const Route = createFileRoute("/_navigation/panel/my-builds")({
  component: RouteComponent,
  pendingComponent: MyBuildsRoutePending,
  errorComponent: MyBuildsRouteError,
  notFoundComponent: MyBuildsRouteNotFound,
  loader: ({ context: { dbClient, session } }) =>
    dbClient.collection(buildsCollection(session.user.id)).preload(),
})

/** Library route: binds the signed-in user to the page. */
function RouteComponent() {
  const { session } = Route.useRouteContext()

  return <MyBuildsRoute user={session.user} />
}

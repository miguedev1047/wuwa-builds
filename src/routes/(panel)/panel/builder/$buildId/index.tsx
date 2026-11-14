import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useBuildCollection } from "@build/client/hooks/build-live-queries"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { BuildEditorWorkspace } from "@build/presentation/editor/components/workspace/build-editor-workspace"
import { buildEdits } from "@build/application/build-edits"
import { BuildIdentityProvider } from "@build/presentation/editor/build-identity"
import {
  buildCollection,
  deleteBuild,
  updateBuild,
} from "@build/client/build-store"

export const Route = createFileRoute("/(panel)/panel/builder/$buildId/")({
  component: RouteComponent,
  pendingComponent: () => <Spinner />,
  ssr: false,
  loader: async () => {
    await buildCollection.preload()
  },
})

function RouteComponent() {
  const { buildId } = Route.useParams()
  const { session } = Route.useRouteContext()
  const sessionId = session.session.id
  const navigate = useNavigate()
  const { data: build } = useBuildCollection({ buildId, sessionId })

  if (!build) {
    return (
      <div className="space-y-4 p-8">
        <Button
          nativeButton={false}
          render={<Link to="/panel/my-builds">Volver</Link>}
        />
        <h1 className="text-lg font-medium">Build no encontrada</h1>
        <p className="text-sm text-muted-foreground">
          La build no existe o pertenece a otra sesión.
        </p>
      </div>
    )
  }

  const identity = { buildId, sessionId }

  return (
    <BuildIdentityProvider identity={identity}>
      <BuildEditorWorkspace
        build={build}
        backLink={<Link to="/panel/my-builds" />}
        onRename={(name) =>
          updateBuild(identity, (draft) => buildEdits.rename(draft, name))
        }
        onDelete={() => {
          if (deleteBuild(identity)) void navigate({ to: "/panel/my-builds" })
        }}
      />
    </BuildIdentityProvider>
  )
}

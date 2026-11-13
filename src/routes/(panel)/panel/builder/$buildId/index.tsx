import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  useBuildCollection,
  useSessionId,
} from "@panel/user/builds/application/build-live-queries"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { BuildEditorWorkspace } from "@builder/components/workspace/build-editor-workspace"
import { buildEdits } from "@builds/application/build-edits"
import { useBuilderId } from "@builder/application/use-builder-id"
import {
  buildCollection,
  deleteBuild,
  updateBuild,
} from "@builds/client/build-store"

export const Route = createFileRoute("/(panel)/panel/builder/$buildId/")({
  component: RouteComponent,
  pendingComponent: () => <Spinner />,
  ssr: false,
  loader: async () => {
    await buildCollection.preload()
  },
})

function RouteComponent() {
  const buildId = useBuilderId()
  const sessionId = useSessionId()
  const navigate = useNavigate()
  const { data: build } = useBuildCollection({ buildId })

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
  )
}

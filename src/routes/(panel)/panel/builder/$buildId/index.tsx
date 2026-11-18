import { Button } from "@/components/panelui/button"
import { Spinner } from "@/components/panelui/spinner"
import { buildEdits } from "@build/application/build-edits"
import {
  buildCollection,
  deleteBuild,
  updateBuild,
} from "@build/client/build-store"
import { useBuildCollection } from "@build/client/hooks/build-live-queries"
import { BuildIdentityProvider } from "@build/presentation/editor/build-identity"
import { BuildEditorWorkspace } from "@build/presentation/editor/components/workspace/build-editor-workspace"
import type { DockLinkItem } from "@/components/ui/dock"
import { ChevronLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  createFileRoute,
  Link,
  linkOptions,
  useNavigate,
} from "@tanstack/react-router"

const backLink = {
  type: "link",
  label: "Volver",
  icon: <HugeiconsIcon icon={ChevronLeftIcon} />,
  linkOptions: linkOptions({ to: "/panel/my-builds" }),
} satisfies DockLinkItem

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
  const userId = session.user.id
  const navigate = useNavigate()
  const { data: build } = useBuildCollection({ buildId, userId })

  if (!build) {
    return (
      <div className="space-y-4 p-8">
        <Button
          nativeButton={false}
          render={<Link to="/panel/my-builds">Volver</Link>}
        />
        <h1 className="text-lg font-medium">Build no encontrada</h1>
        <p className="text-sm text-muted-foreground">
          La build no existe o pertenece a otra cuenta.
        </p>
      </div>
    )
  }

  const identity = { buildId, userId }

  return (
    <BuildIdentityProvider identity={identity}>
      <BuildEditorWorkspace
        build={build}
        backLink={backLink}
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

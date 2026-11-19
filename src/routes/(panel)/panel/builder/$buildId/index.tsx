import { buildCollection } from "@build/client/build-store"
import { useBuildCollection } from "@build/client/hooks/build-live-queries"
import { BuildIdentityProvider } from "@build/presentation/editor/build-identity"
import { BuildEditorWorkspace } from "@build/presentation/editor/components/workspace/build-editor-workspace"
import { useBuildActions } from "@build/presentation/editor/hooks/use-build-actions"
import type { DockLinkItem } from "@/components/ui/dock"
import {
  BuildRouteError,
  BuildRouteNotFound,
  BuildRoutePending,
} from "@/routing/build/route-state"
import { ChevronLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  createFileRoute,
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
  const { session } = Route.useRouteContext()
  const userId = session.user.id

  const { data: liveBuild } = useBuildCollection({ buildId, userId })

  const { build, rename, remove } = useBuildActions({
    liveBuild,
    buildId,
    onDeleted: () => navigate({ to: "/panel/my-builds" }),
  })

  if (!build) return <BuildRouteNotFound />

  const identity = { buildId, userId }

  return (
    <BuildIdentityProvider identity={identity}>
      <BuildEditorWorkspace
        build={build}
        backLink={backLink}
        onRename={rename}
        onDelete={remove}
      />
    </BuildIdentityProvider>
  )
}

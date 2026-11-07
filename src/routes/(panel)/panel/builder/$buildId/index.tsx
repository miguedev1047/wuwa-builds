import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { JsonDevtool } from "@/components/utility/devtools"
import { deleteBuild } from "@/modules/builds/client/build-store"
import { useBuildCollection } from "@/modules/panel/user/builds/application/build-live-queries"
import { BuilderRoot } from "@/modules/panel/user/builder/components/builder-root"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router"

export const Route = createFileRoute("/(panel)/panel/builder/$buildId/")({
  component: RouteComponent,
  pendingComponent: () => <Spinner />,
  ssr: false,
})

function RouteComponent() {
  const { buildId } = useParams({
    from: "/(panel)/panel/builder/$buildId/",
  })
  const navigate = useNavigate()
  const { data: build } = useBuildCollection({ buildId })

  const handleDeleteBuild = () => {
    deleteBuild(buildId)
    navigate({ to: "/panel/my-builds" })
  }

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

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <Button
          nativeButton={false}
          render={<Link to="/panel/my-builds">Volver</Link>}
        />

        <Button variant="destructive" onClick={handleDeleteBuild} size="icon">
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      </div>

      <BuilderRoot build={build} />

      <JsonDevtool title="Build response" data={build} />
    </div>
  )
}

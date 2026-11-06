import { Button } from "@/components/ui/button"
import { buildCollection } from "@/modules/builds/infrastructure/local-storage/build-drafts"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { echoQueries } from "@/modules/game-data/queries/echoes"
import { weaponQueries } from "@/modules/game-data/queries/weapons"
import { BuilderRoot } from "@/modules/panel/user/builder/components/builder-root"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
} from "@tanstack/react-router"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"

export const Route = createFileRoute(
  "/(panel)/panel/builder/r/$rosterId/b/$buildId/"
)({
  component: RouteComponent,
  ssr: false,
  loader: async ({ context, params }) => {
    const rosterId = parseInt(params.rosterId)

    await Promise.all([
      context.queryClient.query(characterQueries.detail(rosterId)),
      context.queryClient.query(weaponQueries.list()),
      context.queryClient.query(echoQueries.list()),
    ])
  },
})

function RouteComponent() {
  const { buildId, rosterId } = useParams({
    from: "/(panel)/panel/builder/r/$rosterId/b/$buildId/",
  })

  const navigate = useNavigate()

  const handleDeleteBuild = () => {
    buildCollection.delete(buildId)
    navigate({ to: "/panel/my-builds" })
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            nativeButton={false}
            render={<Link to="/panel/my-builds">Volver</Link>}
          />
          <Button
            nativeButton={false}
            render={
              <Link to="/panel/builder/r/$rosterId" params={{ rosterId }} />
            }
          >
            Builds
          </Button>
        </div>
        <Button variant="destructive" onClick={handleDeleteBuild} size="icon">
          <HugeiconsIcon icon={DeleteIcon} />
        </Button>
      </div>

      <SkeletonSuspense skeleton={<SkeletonBox width="100%" height={100} />}>
        <BuilderRoot />
      </SkeletonSuspense>
    </div>
  )
}

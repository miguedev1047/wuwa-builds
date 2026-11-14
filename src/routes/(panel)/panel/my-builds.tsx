import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { buildCollection } from "@build/client/build-store"
import { MAX_LOCAL_BUILDS } from "@build/domain/build"
import { useCreateBuild } from "@build/presentation/collection/hooks/use-create-build"
import { LocalBuildList } from "@build/presentation/collection/components/local-build-list"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { Suspense } from "react"

export const Route = createFileRoute("/(panel)/panel/my-builds")({
  component: RouteComponent,
  ssr: false,
  loader: async () => {
    await buildCollection.preload()
  },
})

function RouteComponent() {
  const { session } = Route.useRouteContext()
  const user = session.user
  const navigate = useNavigate()
  const { buildCount, createBuild } = useCreateBuild(
    session.session.id,
    (buildId) => {
      void navigate({ to: "/panel/builder/$buildId", params: { buildId } })
    }
  )

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-20">
      <div className="space-y-4">
        <h2>Hola {user.name}. Bienvenido al panel.</h2>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Tus builds</h3>

          <div className="flex items-center gap-3">
            <p className="text-xs text-muted-foreground">
              {buildCount}/{MAX_LOCAL_BUILDS} builds
            </p>
            <Button onClick={createBuild}>Nueva Build</Button>
          </div>
        </div>

        <Suspense fallback={<Spinner />}>
          <LocalBuildList
            sessionId={session.session.id}
            RosterLink={RosterLink}
            BuildLink={BuildLink}
          />
        </Suspense>
      </section>
    </div>
  )
}

/** Route-owned link for a resonator group. */
function RosterLink({
  id,
  children,
}: {
  id: number
  children: React.ReactNode
}) {
  return (
    <Link to="/panel/builder/r/$rosterId" params={{ rosterId: String(id) }}>
      {children}
    </Link>
  )
}
/** Route-owned link for an individual build. */
function BuildLink({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <Link to="/panel/builder/$buildId" params={{ buildId: id }}>
      {children}
    </Link>
  )
}

import { Spinner } from "@/components/ui/spinner"
import { LocalBuildList } from "@/modules/panel/user/my-builds/components/local-build-list"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/(panel)/panel/my-builds")({
  component: RouteComponent,
  ssr: false,
})

function RouteComponent() {
  const { session } = Route.useRouteContext()
  const user = session.user

  return (
    <div className="mx-auto max-w-5xl space-y-6 py-20">
      <div className="space-y-4">
        <h2>Hola {user.name}. Bienvenido al panel.</h2>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Tus builds</h3>
          <Button
            nativeButton={false}
            render={<Link to="/panel/new-build">Nueva Build</Link>}
          />
        </div>

        <Suspense fallback={<Spinner />}>
          <LocalBuildList />
        </Suspense>
      </section>
    </div>
  )
}

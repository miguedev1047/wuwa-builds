import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useBuildCollection } from "@/modules/panel/user/builds/application/build-live-queries"
import { createFileRoute, Link } from "@tanstack/react-router"
import { BuildShell } from "@/modules/panel/user/builder/components/build-shell"
import { useBuilderId } from "@/modules/panel/user/builder/application/use-builder-id"

export const Route = createFileRoute("/(panel)/panel/builder/$buildId/")({
  component: RouteComponent,
  pendingComponent: () => <Spinner />,
  ssr: false,
})

function RouteComponent() {
  const buildId = useBuilderId()
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

  return <BuildShell />
}

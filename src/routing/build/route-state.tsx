import { Button } from "@/components/panelui/button"
import {
  RouteStateFrame,
  RouteStatePending,
  errorText,
} from "@/routing/build/route-state-frame"
import {
  Alert02Icon,
  ArrowLeft02Icon,
  SearchRemoveIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link, type ErrorComponentProps } from "@tanstack/react-router"

/** Loading state of the builder route, while the build collection is read. */
export function BuildRoutePending() {
  return <RouteStatePending label="Cargando build" />
}

/** State for a build that does not exist. */
export function BuildRouteNotFound() {
  return (
    <RouteStateFrame
      icon={<HugeiconsIcon icon={SearchRemoveIcon} />}
      title="Build no encontrada"
      description="La build no existe."
      action={
        <Button
          nativeButton={false}
          render={
            <Link to="/panel/my-builds">
              <HugeiconsIcon icon={ArrowLeft02Icon} />
              Volver a mis builds
            </Link>
          }
        />
      }
    />
  )
}

/** Error state of the builder route, with retry and a way back to the library. */
export function BuildRouteError({ error, reset }: ErrorComponentProps) {
  return (
    <RouteStateFrame
      icon={<HugeiconsIcon icon={Alert02Icon} />}
      title="No se pudo cargar la build"
      description={errorText(
        error,
        "Ocurrió un error inesperado. Intenta de nuevo."
      )}
      detail={
        import.meta.env.DEV && error instanceof Error ? (
          <pre className="max-w-2xl overflow-x-auto rounded-xl border bg-muted/40 p-3 text-left text-xs whitespace-pre-wrap text-muted-foreground">
            {error.stack}
          </pre>
        ) : undefined
      }
      action={
        <>
          <Button type="button" onClick={reset}>
            Reintentar
          </Button>

          <Button
            variant="outline"
            nativeButton={false}
            render={
              <Link to="/panel/my-builds">
                <HugeiconsIcon icon={ArrowLeft02Icon} />
                Mis builds
              </Link>
            }
          />
        </>
      }
    />
  )
}

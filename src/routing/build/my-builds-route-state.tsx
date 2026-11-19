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

/** Loading state of the My Builds route, while the collection is read. */
export function MyBuildsRoutePending() {
  return <RouteStatePending label="Cargando builds" />
}

/** State for a My Builds address that does not exist. */
export function MyBuildsRouteNotFound() {
  return (
    <RouteStateFrame
      backLink={false}
      icon={<HugeiconsIcon icon={SearchRemoveIcon} />}
      title="No se encontró la página"
      description="La sección que buscas no existe."
      action={
        <Button
          nativeButton={false}
          render={
            <Link to="/">
              <HugeiconsIcon icon={ArrowLeft02Icon} />
              Ir al inicio
            </Link>
          }
        />
      }
    />
  )
}

/** Error state of the My Builds route, with retry and a way home. */
export function MyBuildsRouteError({ error, reset }: ErrorComponentProps) {
  return (
    <RouteStateFrame
      backLink={false}
      icon={<HugeiconsIcon icon={Alert02Icon} />}
      title="No se pudieron cargar las builds"
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
              <Link to="/">
                <HugeiconsIcon icon={ArrowLeft02Icon} />
                Ir al inicio
              </Link>
            }
          />
        </>
      }
    />
  )
}

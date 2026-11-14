import { isCatalogNotFound } from "@catalog/domain/catalog-error"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Show } from "@/components/utility/show"
import {
  Alert02Icon,
  ArrowLeft02Icon,
  SearchRemoveIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link, type ErrorComponentProps } from "@tanstack/react-router"

type RouteErrorProps = ErrorComponentProps & {
  /** Headline of the state; defaults to a generic load error. */
  title?: string
  /** Text shown when the error is not an `Error` instance. */
  description?: string
}

/**
 * Readable text of a thrown value.
 *
 * `JSON.stringify(new Error("boom"))` is `"{}"`: `message` and `stack` are not
 * enumerable, so the value must be read directly.
 */
function errorText(error: unknown, fallback: string): string {
  if (error instanceof Error) return error.message || error.name
  if (typeof error === "string") return error
  if (error === null || error === undefined) return fallback

  try {
    return JSON.stringify(error) ?? fallback
  } catch {
    return String(error)
  }
}

/** Full-page error state inherited by every admin catalog route. */
export function RouteError({
  error,
  reset,
  title = "No se pudo cargar la pagina",
  description = "Ocurrio un error inesperado. Intenta de nuevo.",
}: RouteErrorProps) {
  if (isCatalogNotFound(error)) return <RouteNotFound />
  return (
    <div className="grid min-h-100 place-content-center">
      <Empty>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={Alert02Icon} />
        </EmptyMedia>

        <EmptyHeader>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{errorText(error, description)}</EmptyDescription>
        </EmptyHeader>

        <Show
          when={
            import.meta.env.DEV && error instanceof Error ? error.stack : null
          }
        >
          {(stack) => (
            <pre className="max-w-2xl overflow-x-auto rounded-xl border bg-muted/40 p-3 text-left text-xs whitespace-pre-wrap text-muted-foreground">
              {stack}
            </pre>
          )}
        </Show>

        <EmptyContent className="flex-row justify-center">
          <Button type="button" onClick={reset}>
            Reintentar
          </Button>

          <Button
            variant="outline"
            nativeButton={false}
            render={<Link to="/admin">Volver al panel</Link>}
          />
        </EmptyContent>
      </Empty>
    </div>
  )
}

/** Full-page 404 state inherited by every admin catalog route. */
export function RouteNotFound() {
  return (
    <div className="grid min-h-100 place-content-center">
      <Empty>
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={SearchRemoveIcon} />
        </EmptyMedia>

        <EmptyHeader>
          <EmptyTitle>No encontrado</EmptyTitle>
          <EmptyDescription>
            El recurso que buscas no existe o fue eliminado.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent>
          <Button
            nativeButton={false}
            render={
              <Link to="/admin">
                <HugeiconsIcon icon={ArrowLeft02Icon} />
                Volver al panel
              </Link>
            }
          />
        </EmptyContent>
      </Empty>
    </div>
  )
}

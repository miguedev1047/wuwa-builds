import { Button } from "@/components/panelui/button"
import { Spinner } from "@/components/panelui/spinner"
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
  ChevronLeftIcon,
  SearchRemoveIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link, type ErrorComponentProps } from "@tanstack/react-router"
import type { ReactNode } from "react"

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

/** Decorative dot grid shared by the full-screen builder states. */
function DotBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="dot-backdrop pointer-events-none absolute inset-0 text-foreground opacity-20"
    />
  )
}

type BuildStateFrameProps = {
  /** Icon drawn above the state text. */
  icon: ReactNode
  /** Headline of the state. */
  title: string
  /** One sentence that explains what happened. */
  description: ReactNode
  /** Extra content under the description, such as a dev stack trace. */
  detail?: ReactNode
  /** Actions of the state. */
  action?: ReactNode
}

/** Builder-shaped frame: back link on top, centered state below. */
function BuildStateFrame({
  icon,
  title,
  description,
  detail,
  action,
}: BuildStateFrameProps) {
  return (
    <div className="relative flex h-svh w-full flex-col overflow-hidden bg-background">
      <DotBackdrop />

      <header className="relative flex items-center px-3 py-3 md:px-6">
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={
            <Link to="/panel/my-builds">
              <HugeiconsIcon icon={ChevronLeftIcon} />
              Mis builds
            </Link>
          }
        />
      </header>

      <div className="relative grid flex-1 place-content-center px-4">
        <Empty>
          <EmptyMedia variant="icon">{icon}</EmptyMedia>

          <EmptyHeader>
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription>{description}</EmptyDescription>
          </EmptyHeader>

          <Show when={detail}>{detail}</Show>

          <Show when={action}>
            <EmptyContent className="flex-row justify-center">
              {action}
            </EmptyContent>
          </Show>
        </Empty>
      </div>
    </div>
  )
}

/** Loading state of the builder route, while the build collection is read. */
export function BuildRoutePending() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative grid h-svh w-full place-content-center overflow-hidden bg-background"
    >
      <DotBackdrop />

      <span className="relative flex items-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        Cargando build
      </span>
    </div>
  )
}

/** State for a build that does not exist. */
export function BuildRouteNotFound() {
  return (
    <BuildStateFrame
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
    <BuildStateFrame
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

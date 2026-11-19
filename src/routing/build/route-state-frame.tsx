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
import { ChevronLeftIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import type { ReactNode } from "react"

/**
 * Readable text of a thrown value.
 *
 * `JSON.stringify(new Error("boom"))` is `"{}"`: `message` and `stack` are not
 * enumerable, so the value must be read directly.
 */
export function errorText(error: unknown, fallback: string): string {
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

type RouteStateFrameProps = {
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
  /**
   * Draws the way back to My Builds above the state. Turn it off when the
   * state belongs to My Builds itself, so it does not link to its own page.
   */
  backLink?: boolean
}

/** Full-screen frame for a route state: optional back link, state centered. */
export function RouteStateFrame({
  icon,
  title,
  description,
  detail,
  action,
  backLink = true,
}: RouteStateFrameProps) {
  return (
    <div className="relative flex h-svh w-full flex-col overflow-hidden bg-background">
      <DotBackdrop />

      {backLink ? (
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
      ) : null}

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

/** Full-height waiting state, with the same dot backdrop as the rest. */
export function RouteStatePending({ label }: { label: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="relative grid h-svh w-full place-content-center overflow-hidden bg-background"
    >
      <DotBackdrop />

      <span className="relative flex items-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        {label}
      </span>
    </div>
  )
}

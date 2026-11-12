import { cn } from "cn"
import type { ComponentProps } from "react"

/** Grid surface of the builder workspace. */
export function BuildWorkspaceRoot({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="build-workspace"
      className={cn("build-workspace min-h-0 flex-1 gap-6", className)}
      {...props}
    />
  )
}

/**
 * Dotted frame that hosts the build preview.
 *
 * At `xl` it fills the workspace row and scrolls on its own; below `xl` it
 * grows with the canvas and the page scrolls instead.
 */
export function BuildWorkspaceStage({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="build-workspace-stage"
      className={cn(
        "build-workspace-stage no-scrollbar flex min-h-0 scroll-fade-y overflow-auto rounded-4xl bg-muted/20 p-4 ring-1 ring-foreground/5 xl:ps-12 dark:ring-foreground/10",
        className
      )}
      {...props}
    />
  )
}

/**
 * Scaled wrapper around the read-only canvas.
 *
 * The scale lives in `.build-canvas-preview`; no zoom logic belongs here or in
 * the canvas panels.
 */
export function BuildWorkspacePreview({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="build-workspace-preview"
      className={cn("build-canvas-preview m-auto", className)}
      {...props}
    />
  )
}

/**
 * Editor rail of the workspace.
 *
 * At `xl` it scrolls inside the workspace with a hidden scrollbar; below `xl`
 * it flows under the stage and the page scrolls.
 */
export function BuildWorkspaceRail({
  className,
  ...props
}: ComponentProps<"aside">) {
  return (
    <aside
      data-slot="build-workspace-rail"
      className={cn(
        "no-scrollbar min-h-0 scroll-fade-y space-y-6 xl:overflow-y-auto xl:overscroll-contain",
        className
      )}
      {...props}
    />
  )
}

/**
 * Two-column workspace: dotted preview stage plus the editor rail.
 *
 * The composition is DOM-first: the stage comes before the rail, which is also
 * the mobile order. Below `xl` the rail collapses under the stage.
 */
export const BuildWorkspace = {
  Root: BuildWorkspaceRoot,
  Stage: BuildWorkspaceStage,
  Preview: BuildWorkspacePreview,
  Rail: BuildWorkspaceRail,
} as const

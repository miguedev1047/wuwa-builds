import { Canvas } from "@/components/panelui/canvas"
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
 * Stage of the workspace: the PanelUI canvas with its dot pattern and pointer
 * spotlight.
 *
 * At `xl` it fills the workspace row and clips its layers; below `xl` it grows
 * with the preview and the page scrolls. The preview itself scrolls inside
 * `BuildWorkspace.Content`.
 */
export function BuildWorkspaceCanvas({
  className,
  children,
  ...props
}: ComponentProps<typeof Canvas>) {
  return (
    <Canvas
      data-slot="build-workspace-canvas"
      className={cn("min-h-0 rounded-4xl border-8 border-card", className)}
      {...props}
    >
      <Canvas.Pattern variant="dots" />
      <Canvas.Spotlight />
      {children}
    </Canvas>
  )
}

/**
 * Scaled preview surface of the workspace.
 *
 * It is the `Canvas.Content` layer: it sits above the dots, scrolls inside the
 * stage when the preview is taller than the canvas, and centers the build card.
 * The scale lives in `.build-canvas-preview`; no zoom logic belongs here or in
 * the canvas panels.
 */
export function BuildWorkspaceContent({
  className,
  children,
  ...props
}: ComponentProps<typeof Canvas.Content>) {
  return (
    <Canvas.Content
      data-slot="build-workspace-content"
      className={cn(
        "no-scrollbar flex min-h-0 overflow-auto p-8 xl:scroll-fade-y",
        className
      )}
      {...props}
    >
      <div className="build-canvas-preview m-auto w-full">{children}</div>
    </Canvas.Content>
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
        "no-scrollbar min-h-0 space-y-6 xl:scroll-fade-y xl:overflow-y-auto xl:overscroll-contain",
        className
      )}
      {...props}
    />
  )
}

/**
 * Two-column workspace: a PanelUI canvas with the scaled build preview and the
 * editor rail.
 *
 * The composition is DOM-first: the canvas comes before the rail, which is also
 * the mobile order. Below `xl` the rail collapses under the canvas.
 */
export const BuildWorkspace = {
  Root: BuildWorkspaceRoot,
  Canvas: BuildWorkspaceCanvas,
  Content: BuildWorkspaceContent,
  Rail: BuildWorkspaceRail,
} as const

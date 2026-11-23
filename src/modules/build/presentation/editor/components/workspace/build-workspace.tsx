import { Button } from "@/components/panelui/button"
import { Canvas } from "@/components/panelui/canvas"
import { Dialog } from "@/components/panelui/dialog"
import { Empty, EmptyTitle } from "@/components/ui/empty"
import { Show } from "@/components/utility/show"
import {
  BuildCanvasSurface,
  BuildCanvasText,
} from "@build/presentation/components/build-canvas/build-canvas-primitives"
import { cn } from "cn"
import { useState, type ComponentProps, type ReactNode } from "react"

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
 * At `xl` it fills the workspace row; below `xl` it keeps a fixed height. The
 * content never scrolls: the Flow inside pans and zooms the build card.
 */
export function BuildWorkspaceCanvas({
  className,
  children,
  ...props
}: ComponentProps<typeof Canvas>) {
  return (
    <Canvas
      data-slot="build-workspace-canvas"
      className={cn(
        "h-full min-h-0 rounded-4xl border-8 border-card",
        className
      )}
      {...props}
    >
      <Canvas.Pattern variant="dots" />
      <Canvas.Spotlight />
      {children}
    </Canvas>
  )
}

/**
 * Preview surface of the workspace.
 *
 * It is the `Canvas.Content` layer: it fills the fixed stage, clips what the
 * Flow paints outside it and leaves the panning and zooming to the Flow. It
 * never scrolls.
 */
export function BuildWorkspaceContent({
  className,
  children,
  ...props
}: ComponentProps<typeof Canvas.Content>) {
  return (
    <Canvas.Content
      data-slot="build-workspace-content"
      className={cn("flex min-h-0 overflow-hidden p-4", className)}
      {...props}
    >
      {children}
    </Canvas.Content>
  )
}

interface BuildWorkspaceDialogProps {
  title: string
  description?: string
  triggerComponent?: React.ReactElement
  dialogProps?: ComponentProps<typeof Dialog>
  dialogContentProps?: React.ComponentProps<typeof Dialog.Content>
  bodyClassName?: string
  children: (controls: { close: () => void }) => ReactNode
  showFooter?: boolean
}

export function BuildWorkspaceDialog({
  children,
  title,
  triggerComponent,
  dialogProps,
  dialogContentProps,
  showFooter = false,
  description,
}: BuildWorkspaceDialogProps) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <Dialog open={open} onOpenChange={setOpen} {...dialogProps}>
      <Show when={triggerComponent}>
        {(trigger) => <Dialog.Trigger render={trigger} />}
      </Show>
      <Dialog.Content size="lg" {...dialogContentProps}>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Show when={description}>
            <Dialog.Description>{description}</Dialog.Description>
          </Show>
        </Dialog.Header>

        <Dialog.Body
          className={cn("-mx-1 no-scrollbar max-h-96 overflow-y-auto pt-1")}
        >
          {children({ close })}
        </Dialog.Body>

        <Show when={showFooter}>
          <Dialog.Footer>
            <Dialog.Close render={<Button>Cerrar</Button>} />
          </Dialog.Footer>
        </Show>
      </Dialog.Content>
    </Dialog>
  )
}

interface BuildWorkspaceEmptyProps extends React.ComponentProps<typeof Empty> {
  enabled?: boolean
}

function BuildWorkspaceEmpty({
  className,
  enabled = true,
  ...props
}: BuildWorkspaceEmptyProps) {
  return (
    <Empty
      role="button"
      tabIndex={enabled ? 0 : -1}
      aria-disabled={!enabled}
      data-enabled={enabled}
      className={cn(
        "group/empty h-100 border border-dashed transition ease-in-out",
        "data-[enabled=true]:cursor-pointer data-[enabled=true]:hover:border-brand-accent",
        "data-[enabled=false]:cursor-not-allowed data-[enabled=false]:opacity-60",
        className
      )}
      {...props}
    />
  )
}

interface BuildWorkspaceEmptyTitleProps extends React.ComponentProps<
  typeof EmptyTitle
> {
  title: string
}

function BuildWorkspaceEmptyTitle({
  title,
  className,
  ...props
}: BuildWorkspaceEmptyTitleProps) {
  return (
    <EmptyTitle
      className={cn(
        "text-muted-foreground transition ease-in-out",
        "group-data-[enabled=true]/empty:group-hover/empty:text-brand-accent",
        className
      )}
      {...props}
    >
      {title}
    </EmptyTitle>
  )
}

/** Workspace surface for the canvas shown beside the editor inspector. */
export const BuildWorkspace = {
  Root: BuildWorkspaceRoot,
  Canvas: BuildWorkspaceCanvas,
  Content: BuildWorkspaceContent,
  Dialog: BuildWorkspaceDialog,
  Empty: BuildWorkspaceEmpty,
  EmptyTitle: BuildWorkspaceEmptyTitle,
  Text: BuildCanvasText,
  Card: BuildCanvasSurface,
} as const

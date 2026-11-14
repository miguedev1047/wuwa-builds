import { Canvas } from "@/components/panelui/canvas"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/panelui/dialog"
import { Show } from "@/components/utility/show"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { useState, type ComponentProps, type ReactNode } from "react"
import { Empty, EmptyTitle } from "@/components/ui/empty"

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
        "h-150 min-h-0 rounded-4xl border-8 border-card xl:h-full",
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

/** Heading sizes available to the builder sections. */
export const buildWorkspaceTextVariants = cva(
  "line-clamp-1 font-bold text-muted-foreground uppercase",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        normal: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
        "5xl": "text-5xl",
        "6xl": "text-6xl",
      },
      family: {
        normal: "font-normal",
        semibold: "font-semibold",
        bold: "font-bold",
      },
      textColor: {
        normal: "text-foreground",
        muted: "text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "normal",
      family: "semibold",
      textColor: "normal",
    },
  }
)

export interface BuildWorkspaceTextProps
  extends
    React.ComponentProps<"h2">,
    VariantProps<typeof buildWorkspaceTextVariants> {}

/**
 * Section heading of the builder surfaces.
 *
 * It always renders an `h2`, so the screen keeps one `h1` per route and every
 * section title stays at the same level.
 */
export function BuildWorkspaceText({
  className,
  textColor,
  family,
  size,
  ...props
}: BuildWorkspaceTextProps) {
  return (
    <h2
      className={cn(
        buildWorkspaceTextVariants({ size, textColor, family }),
        className
      )}
      {...props}
    />
  )
}

export const buildWorkspaceCardVariants = cva(
  "rounded-lg p-4 shadow-app-surface",
  {
    variants: {
      cardColor: {
        default: "bg-card",
        glass: "bg-card/50 backdrop-blur-2xl",
        input: "bg-input/50",
        muted: "bg-muted",
      },
    },
    defaultVariants: {
      cardColor: "default",
    },
  }
)

export interface BuildWorkspaceCardProps
  extends
    React.ComponentProps<"div">,
    VariantProps<typeof buildWorkspaceCardVariants> {}

export function BuildWorkspaceCard({
  className,
  cardColor,
  ...props
}: BuildWorkspaceCardProps) {
  return (
    <div
      className={cn(buildWorkspaceCardVariants({ cardColor }), className)}
      {...props}
    />
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
        "group/empty h-32 border border-dashed transition ease-in-out",
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
  Dialog: BuildWorkspaceDialog,
  Empty: BuildWorkspaceEmpty,
  EmptyTitle: BuildWorkspaceEmptyTitle,
  Text: BuildWorkspaceText,
  Rail: BuildWorkspaceRail,
  Card: BuildWorkspaceCard,
} as const

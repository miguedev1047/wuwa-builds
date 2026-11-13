import { Flow } from "@/components/panelui/flow"
import { cn } from "cn"

/** Interactive viewport of the builder canvas. */
export function BuildWorkspaceStage({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="build-canvas"
      className={cn("relative h-full w-full", className)}
      {...props}
    >
      <Flow
        fitViewOnMount
        minZoom={0.2}
        fitViewPadding={16}
        label="Vista previa de la build"
        className="h-full w-full overflow-visible rounded-none border-0 bg-transparent"
      >
        <Flow.Node
          id="build-card"
          position={{ x: 0, y: 0 }}
          className="w-7xl rounded-4xl border-0 bg-card p-4 text-sm text-card-foreground shadow-none ring-1 ring-foreground/5 dark:ring-foreground/10"
        >
          <Flow.NodeContent className="p-0">{children}</Flow.NodeContent>
        </Flow.Node>

        <Flow.Controls />
      </Flow>
    </section>
  )
}

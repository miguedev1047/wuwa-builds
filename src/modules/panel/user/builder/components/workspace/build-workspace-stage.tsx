import { Flow } from "@/components/panelui/flow"
import { buildCardFrameClassName } from "@builder/components/build-canvas/build-card-frame"
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
          className={buildCardFrameClassName}
        >
          <Flow.NodeContent className="p-0">{children}</Flow.NodeContent>
        </Flow.Node>

        <Flow.Controls />
      </Flow>
    </section>
  )
}

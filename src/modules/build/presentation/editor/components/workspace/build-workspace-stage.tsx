import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { Flow } from "@/components/panelui/flow"
import { buildCardFrameClassName } from "@build/presentation/editor/components/build-canvas/build-card-frame"
import { cn } from "cn"
import { useBuildCollection } from "@build/client/hooks/build-live-queries"
import { BuildBackground } from "@build/presentation/editor/components/workspace/build-background"

/** Interactive viewport of the builder canvas. */
export function BuildWorkspaceStage({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  const { buildId, sessionId } = useBuildIdentity()
  const { data: build } = useBuildCollection({ buildId, sessionId })

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
          className={cn(buildCardFrameClassName, "overflow-hidden")}
        >
          <BuildBackground backgroundIndex={build?.backgroundIndex ?? null}>
            <Flow.NodeContent className="relative p-0">
              {children}
            </Flow.NodeContent>
          </BuildBackground>
        </Flow.Node>

        <Flow.Controls />
      </Flow>
    </section>
  )
}

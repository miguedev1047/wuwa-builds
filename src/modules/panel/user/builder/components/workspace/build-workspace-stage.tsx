import { Flow } from "@/components/panelui/flow"
import { buildCardFrameClassName } from "@builder/components/build-canvas/build-card-frame"
import { cn } from "cn"
import { useBuilderId } from "../../application/use-builder-id"
import { useBuildCollection } from "../../../builds/application/build-live-queries"
import { BACKGROUNDS } from "@/modules/builds/application/backgrounds"

/** Interactive viewport of the builder canvas. */
export function BuildWorkspaceStage({
  className,
  children,
  ...props
}: React.ComponentProps<"section">) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const currentBackground = BACKGROUNDS[build?.backgroundIndex ?? 0]

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
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div
              className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat blur-app-backdrop"
              style={{ backgroundImage: `url(${currentBackground})` }}
            />
          </div>
          <Flow.NodeContent className="relative p-0">
            {children}
          </Flow.NodeContent>
        </Flow.Node>

        <Flow.Controls />
      </Flow>
    </section>
  )
}

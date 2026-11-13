import { Flow } from "@/components/panelui/flow"
import { BuildCanvasCard } from "@builder/components/build-canvas/build-canvas-card"
import { EchoesPanel } from "@builder/components/build-canvas/echoes-panel"
import { ResonatorPanel } from "@builder/components/build-canvas/resonator-panel"
import { SequencesPanel } from "@builder/components/build-canvas/sequences-panel"
import { SkillsPanel } from "@builder/components/build-canvas/skills-panel"
import { StatsPanel } from "@builder/components/build-canvas/stats-panel"
import { WeaponPanel } from "@builder/components/build-canvas/weapon-panel"
import { cn } from "cn"

/** Grid surface of the read-only build canvas. */
export function BuildCanvasRoot({
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
          <Flow.NodeContent className="p-0">
            <div className="build-canvas relative">{children}</div>
          </Flow.NodeContent>
        </Flow.Node>

        <Flow.Controls />
      </Flow>
    </section>
  )
}

/**
 * Read-only canvas that lays out the build preview panels.
 *
 * Compose it with the parts, which are plain grid items: the placement comes
 * from the named areas in `.build-canvas`, not from the composition.
 */
export const BuildCanvas = {
  Root: BuildCanvasRoot,
  Card: BuildCanvasCard,
  Sequences: SequencesPanel,
  Resonator: ResonatorPanel,
  Stats: StatsPanel,
  Skills: SkillsPanel,
  Weapon: WeaponPanel,
  Echoes: EchoesPanel,
} as const

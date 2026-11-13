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
  ...props
}: React.ComponentProps<"section">) {
  return (
    <section
      data-slot="build-canvas"
      className={cn(
        "build-canvas pointer-events-none relative rounded-4xl bg-card p-4 text-sm text-card-foreground ring-1 ring-foreground/5 select-none dark:ring-foreground/10",
        className
      )}
      {...props}
    />
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

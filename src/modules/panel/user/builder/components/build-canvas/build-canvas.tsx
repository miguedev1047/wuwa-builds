import { BuildCard } from "@builder/ui/build-card"
import { buildCanvasAreas } from "@builder/components/build-canvas/build-canvas-layout"
import { EchoesPanel } from "@builder/components/build-canvas/echoes-panel"
import { ResonatorPanel } from "@builder/components/build-canvas/resonator-panel"
import { SequencesPanel } from "@builder/components/build-canvas/sequences-panel"
import { SkillsPanel } from "@builder/components/build-canvas/skills-panel"
import { StatsPanel } from "@builder/components/build-canvas/stats-panel"
import { WeaponPanel } from "@builder/components/build-canvas/weapon-panel"

/** Read-only canvas that lays out the build preview panels. */
export function BuildCanvas() {
  return (
    <BuildCard className="relative z-40 mt-100 w-auto scale-75 overflow-visible max-md:hidden">
      <SequencesPanel />

      <div className="grid h-full w-full grid-cols-1 gap-4 overflow-y-auto md:grid-cols-10 md:grid-rows-12 md:overflow-visible">
        <div className={buildCanvasAreas.resonator}>
          <ResonatorPanel />
        </div>

        <div className={buildCanvasAreas.stats}>
          <StatsPanel />
        </div>

        <div className={buildCanvasAreas.skills}>
          <SkillsPanel />
        </div>

        <div className={buildCanvasAreas.weapon}>
          <WeaponPanel />
        </div>

        <div className={buildCanvasAreas.echoes}>
          <EchoesPanel />
        </div>
      </div>
    </BuildCard>
  )
}

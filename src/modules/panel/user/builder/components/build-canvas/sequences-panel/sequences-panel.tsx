import { SequencesContent } from "@builder/components/build-canvas/sequences-panel/sequences-content"
import { BuildCanvasCard } from "../build-canvas-card"

/** Read-only rail with the sequences of the resonator. */
export function SequencesPanel() {
  return (
    <BuildCanvasCard area="sequencies">
      <SequencesContent />
    </BuildCanvasCard>
  )
}

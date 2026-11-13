import { BuildCanvasCard } from "@builder/components/build-canvas/build-canvas-card"

/** Read-only rail with the sequences of the resonator. */
export function SequencesPanel({ children }: { children: React.ReactNode }) {
  return <BuildCanvasCard area="sequencies">{children}</BuildCanvasCard>
}

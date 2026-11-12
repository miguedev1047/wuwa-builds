import { SequencesContent } from "@builder/components/build-canvas/sequences-panel/sequences-content"

/** Read-only rail with the sequences of the resonator. */
export function SequencesPanel() {
  return (
    <div className="absolute inset-y-0 -left-14 flex -translate-x-1/2 items-center justify-center">
      <SequencesContent />
    </div>
  )
}

import type {
  BuildCanvasData,
  BuildCanvasPreview,
} from "@build/domain/build-canvas"
import { ReadOnlyBuildCard } from "@build/presentation/components/build-canvas/read-only-build-card"
import type { Ref } from "react"

type BuildExportCardProps = {
  build: BuildCanvasData
  preview: BuildCanvasPreview
  captureRef: Ref<HTMLDivElement>
}

/** Render the card at its native size for capture outside the interactive stage. */
export function BuildExportCard({
  build,
  preview,
  captureRef,
}: BuildExportCardProps) {
  return (
    <div
      aria-hidden="true"
      inert
      className="pointer-events-none fixed top-0 right-full"
    >
      <ReadOnlyBuildCard build={build} preview={preview} ref={captureRef} />
    </div>
  )
}

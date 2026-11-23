import type {
  BuildCanvasData,
  BuildCanvasEchoDetail,
} from "@build/domain/build-canvas"
import { BuildEchoCard } from "@build/presentation/components/build-echo-card"

/** Read-only panel with the five echo slots of the build. */
export function EchoesPanel({
  build,
  details,
}: {
  build: BuildCanvasData
  details?: BuildCanvasEchoDetail[]
}) {
  return (
    <div
      data-canvas-area="echoes"
      className="grid h-full min-h-0 gap-2"
    >
      {(build.echoes ?? []).map((slot) => {
        const detail = details?.find((item) => item.id === slot.data?.id)
        const findIcon = detail?.sets.find((s) => s.setId === slot.echoSetId)
        const seiIcon = findIcon?.sonata?.icon

        return (
          <BuildEchoCard
            key={slot.index}
            slot={slot}
            isMain={build.mainEchoSlot === slot.index}
            setIcon={seiIcon}
            className="h-full"
          />
        )
      })}
    </div>
  )
}

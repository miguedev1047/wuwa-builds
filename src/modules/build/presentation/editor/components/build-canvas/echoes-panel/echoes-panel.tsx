import type { EchoDetail } from "@catalog/domain/echo"
import type { BuildProps } from "@build/domain/build-record"
import { BuildEchoCard } from "@build/presentation/components/build-echo-card"

/** Read-only panel with the five echo slots of the build. */
export function EchoesPanel({
  build,
  details,
}: {
  build: BuildProps
  details?: EchoDetail[]
}) {
  return (
    <div
      data-canvas-area="echoes"
      className="grid h-full min-h-0 grid-cols-5 gap-2"
    >
      {(build.echoes ?? []).map((slot) => {
        const detail = details?.find((item) => item.id === slot.data?.id)
        const findIcon = detail?.sets.find((s) => s.setId === slot.echoSetId)
        const seiIcon = findIcon?.icon

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

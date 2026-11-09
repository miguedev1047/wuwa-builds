import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { EchoSlotSection } from "./echo-slot-section"

/** Five echo slots of the build, each with its own editor dialog. */
export function EchoSlotsSection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <div className="grid h-full grid-cols-5 gap-4">
      {(build?.echoes ?? []).map((slot) => (
        <EchoSlotSection key={slot.index} slot={slot} />
      ))}
    </div>
  )
}

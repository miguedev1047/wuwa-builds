import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { EchoSlotSection } from "./echo-slot-section"

/** Five echo slots of the build, each with its own editor dialog. */
export function EchoSlotsSection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  return (
    <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
      {(build?.echoes ?? []).map((slot) => (
        <EchoSlotSection key={slot.index} slot={slot} />
      ))}
    </div>
  )
}

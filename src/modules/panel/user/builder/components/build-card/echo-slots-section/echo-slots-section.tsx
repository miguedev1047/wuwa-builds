import { useQuery } from "@tanstack/react-query"
import { echoQueries } from "@/modules/game-data/queries/echoes"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { EchoSlotSection } from "./echo-slot-section"

/** Five echo slots of the build, each with its own editor dialog. */
export function EchoSlotsSection() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const echoIds = [
    ...new Set(
      (build?.echoes ?? []).flatMap((echo) => (echo.data ? [echo.data.id] : []))
    ),
  ]
  const { data: details } = useQuery(echoQueries.details(echoIds))

  return (
    <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
      {(build?.echoes ?? []).map((slot) => {
        const detail = details?.find((item) => item.id === slot.data?.id)
        const setIcon = detail?.sets.find(
          (set) => set.setId === slot.echoSetId
        )?.icon

        return (
          <EchoSlotSection key={slot.index} slot={slot} setIcon={setIcon} />
        )
      })}
    </div>
  )
}

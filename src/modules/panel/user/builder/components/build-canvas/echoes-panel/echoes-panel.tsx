import { useQuery } from "@tanstack/react-query"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildEchoCard } from "@builder/ui/build-echo-card"
import { echoQueries } from "@game-data/queries/echoes"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"
import { getEchoesIds } from "../../../sections/echoes-section/application/get-echoes-ids"

/** Read-only panel with the five echo slots of the build. */
export function EchoesPanel() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const buildEchoSlots = build?.echoes ?? []
  const echoIds = getEchoesIds(buildEchoSlots)

  const { data: details } = useQuery(echoQueries.details(echoIds))

  return (
    <div
      data-canvas-area="echoes"
      className="grid h-full min-h-0 grid-cols-5 gap-2"
    >
      {(build?.echoes ?? []).map((slot) => {
        const detail = details?.find((item) => item.id === slot.data?.id)
        const findIcon = detail?.sets.find((s) => s.setId === slot.echoSetId)
        const seiIcon = findIcon?.icon

        return (
          <BuildEchoCard
            key={slot.index}
            slot={slot}
            isMain={build?.mainEchoSlot === slot.index}
            setIcon={seiIcon}
            className="h-full"
          />
        )
      })}
    </div>
  )
}

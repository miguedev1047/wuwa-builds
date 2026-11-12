import { useQuery } from "@tanstack/react-query"
import { useBuilderId } from "@builder/application/use-builder-id"
import { BuildEchoCard } from "@builder/ui/build-echo-card"
import { echoQueries } from "@game-data/queries/echoes"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"

/** Read-only panel with the five echo slots of the build. */
export function EchoesPanel() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })

  const echoIds = [
    ...new Set(
      (build?.echoes ?? []).flatMap((echo) => (echo.data ? [echo.data.id] : []))
    ),
  ]
  const { data: details } = useQuery(echoQueries.details(echoIds))

  return (
    <div
      data-canvas-area="echoes"
      className="grid h-full min-h-0 grid-cols-5 gap-2"
    >
      {(build?.echoes ?? []).map((slot) => {
        const detail = details?.find((item) => item.id === slot.data?.id)
        const setIcon = detail?.sets.find(
          (set) => set.setId === slot.echoSetId
        )?.icon

        return (
          <BuildEchoCard
            key={slot.index}
            slot={slot}
            isMain={build?.mainEchoSlot === slot.index}
            setIcon={setIcon}
            className="h-full"
          />
        )
      })}
    </div>
  )
}

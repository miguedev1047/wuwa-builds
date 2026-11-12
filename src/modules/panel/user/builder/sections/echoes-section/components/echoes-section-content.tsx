import { useQuery } from "@tanstack/react-query"
import type { BuildProps } from "@builds/domain/build-record"
import { useEchoProgress } from "@builder/sections/echoes-section/application/use-echo-progress"
import { EchoSlot } from "@builder/sections/echoes-section/components/echo-slot"
import { echoQueries } from "@game-data/queries/echoes"

type EchoesSectionContentProps = {
  build: BuildProps
}

/** Loaded echoes section: five editable slots. */
export function EchoesSectionContent({ build }: EchoesSectionContentProps) {
  const progress = useEchoProgress(build.buildId)

  const echoIds = [
    ...new Set(
      build.echoes.flatMap((echo) => (echo.data ? [echo.data.id] : []))
    ),
  ]
  const { data: details } = useQuery(echoQueries.details(echoIds))

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
      {build.echoes.map((slot) => {
        const detail = details?.find((item) => item.id === slot.data?.id)
        const sets = detail?.sets ?? []
        const setIcon = sets.find((set) => set.setId === slot.echoSetId)?.icon

        return (
          <EchoSlot
            key={slot.index}
            slot={slot}
            sets={sets}
            isMain={build.mainEchoSlot === slot.index}
            setIcon={setIcon}
            progress={progress}
          />
        )
      })}
    </div>
  )
}

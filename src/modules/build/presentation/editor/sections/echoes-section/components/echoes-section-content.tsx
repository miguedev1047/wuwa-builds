import { useQuery } from "@tanstack/react-query"
import type { BuildProps } from "@build/domain/build-record"
import { useEchoProgress } from "@build/presentation/editor/sections/echoes-section/hooks/use-echo-progress"
import { EchoSlot } from "@build/presentation/editor/sections/echoes-section/components/echo-slot"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { echoQueries } from "@catalog/queries/echoes"
import { getEchoesIds } from "@build/presentation/editor/sections/echoes-section/hooks/get-echoes-ids"
import { Show } from "@/components/utility/show"

type EchoesSectionContentProps = {
  build: BuildProps
}

/** Loaded echoes section: five editable slots. */
export function EchoesSectionContent({ build }: EchoesSectionContentProps) {
  const progress = useEchoProgress(build)
  const echoIds = getEchoesIds(build.echoes)
  const { data: details } = useQuery(echoQueries.details(echoIds))

  const noHasEchoesSlots = build.echoes.length < 0
  const hasResonatorSeletecd = build.resonator.data

  return (
    <Show
      when={hasResonatorSeletecd}
      fallback={
        <BuildWorkspace.Empty enabled={false}>
          <BuildWorkspace.EmptyTitle title="Primero selecciona un resonador" />
        </BuildWorkspace.Empty>
      }
    >
      <div className="flex w-full flex-col gap-2">
        <Show when={noHasEchoesSlots}>
          <BuildWorkspace.Text family="bold" textColor="muted" size="xl">
            Ecos
          </BuildWorkspace.Text>
        </Show>

        <div className="grid grid-cols-1 gap-4">
          {build.echoes.map((slot) => {
            const detail = details?.find((item) => item.id === slot.data?.id)
            const sets = detail?.sets ?? []
            const setIcon = sets.find(
              (set) => set.setId === slot.echoSetId
            )?.icon

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
      </div>
    </Show>
  )
}

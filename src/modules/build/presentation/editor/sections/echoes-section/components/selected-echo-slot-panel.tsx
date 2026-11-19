import type {
  BuildProps,
  EchoesDataProps,
} from "@/modules/build/domain/build-record"
import { EchoSlotCard } from "./echo-slot-card"
import { Show } from "@/components/utility/show"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { EchoBuildSearch } from "@build/presentation/editor/searches/echoes"
import { echoQueries } from "@/modules/catalog/queries/echoes"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Suspense } from "react"
import { EchoSlotLoading } from "@build/presentation/editor/sections/echoes-section/ui-states"

interface SelectedEchoSlotPanelProps {
  build: BuildProps
  slot: EchoesDataProps
}

export function SelectedEchoSlotPanel({
  build,
  slot,
}: SelectedEchoSlotPanelProps) {
  const echoSlotId = slot.data?.id ?? 0

  return (
    <Show
      when={echoSlotId}
      fallback={
        <EchoBuildSearch
          slot={slot}
          resonatorId={build.resonator.data?.id ?? 0}
          trigger={
            <BuildWorkspace.Empty className="h-90">
              <BuildWorkspace.EmptyTitle title="Selecciona un eco" />
            </BuildWorkspace.Empty>
          }
        />
      }
    >
      {(echoId) => (
        <Suspense fallback={<EchoSlotLoading />}>
          <SelectedEchoSlotPanelContent
            build={build}
            slot={slot}
            echoId={echoId}
          />
        </Suspense>
      )}
    </Show>
  )
}

export function SelectedEchoSlotPanelContent({
  echoId,
  slot,
  build,
}: {
  echoId: number
  slot: EchoesDataProps
  build: BuildProps
}) {
  const { data: detail } = useSuspenseQuery(echoQueries.detail(echoId))

  const sets = detail.sets ?? []
  const findEchoSet = sets.find((set) => set.setId === slot.echoSetId)
  const setIcon = findEchoSet?.sonata?.icon

  return (
    <EchoSlotCard
      key={slot.index}
      slot={slot}
      sets={sets}
      isMain={build.mainEchoSlot === slot.index}
      build={build}
      setIcon={setIcon}
    />
  )
}

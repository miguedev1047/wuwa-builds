import type { LocalBuildIdentity } from "@build/client/build-store"
import type { EchoesDataProps } from "@build/domain/build-record"
import { useEchoSlotProgress } from "@build/presentation/editor/sections/echoes-section/hooks/use-echo-slot-progress"
import { EchoSlotLevelControl } from "@build/presentation/editor/sections/echoes-section/components/echo-slot-level-control"
import { EchoSlotMainStatSelect } from "@build/presentation/editor/sections/echoes-section/components/echo-slot-main-stat-select"
import { EchoSlotMainToggle } from "@build/presentation/editor/sections/echoes-section/components/echo-slot-main-toggle"
import { EchoSlotSetSelect } from "@build/presentation/editor/sections/echoes-section/components/echo-slot-set-select"
import { EchoSlotSubstatEditor } from "@build/presentation/editor/sections/echoes-section/components/echo-slot-substat-editor"
import { EchoSlotSetLoading } from "@build/presentation/editor/sections/echoes-section/ui-states"
import { Suspense } from "react"

type EchoSlotControlsProps = {
  slot: EchoesDataProps
  echoId: number
  isMain: boolean
  build: LocalBuildIdentity
}

/** Sonata set, main stat, level and substats of the selected echo. */
export function EchoSlotControls({
  slot,
  echoId,
  isMain,
  build,
}: EchoSlotControlsProps) {
  const progress = useEchoSlotProgress(build)

  return (
    <div className="space-y-5">
      <Suspense fallback={<EchoSlotSetLoading />}>
        <EchoSlotSetSelect
          echoId={echoId}
          selectedSetId={slot.echoSetId}
          onChange={(setId) => progress.setSet(slot.index, setId)}
        />
      </Suspense>
      <EchoSlotMainStatSelect
        slot={slot}
        onChange={(option) => progress.setMainStat(slot.index, option)}
      />
      <EchoSlotLevelControl
        slot={slot}
        onChange={(step) => progress.setLevelStep(slot.index, step)}
      />
      <EchoSlotSubstatEditor
        slot={slot}
        onStatChange={(substatIndex, option) =>
          progress.setSubstat(slot.index, substatIndex, option)
        }
        onValueChange={(substatIndex, value) =>
          progress.setSubstatValue(slot.index, substatIndex, value)
        }
      />
      <EchoSlotMainToggle
        isMain={isMain}
        onToggle={() => progress.toggleMain(slot.index)}
      />
    </div>
  )
}

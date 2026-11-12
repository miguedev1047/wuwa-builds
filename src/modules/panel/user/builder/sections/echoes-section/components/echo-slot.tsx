import { SkeletonSuspense } from "skullet/react"
import type { EchoesDataProps } from "@builds/domain/build-record"
import type { EchoProgress } from "@builder/sections/echoes-section/application/use-echo-progress"
import { EchoPicker } from "@builder/sections/echoes-section/components/echo-picker"
import { EchoPickerDialog } from "@builder/sections/echoes-section/components/echo-picker-dialog"
import { EchoPickerSkeleton } from "@builder/sections/echoes-section/components/echo-picker-skeleton"
import { EchoSlotEditor } from "@builder/sections/echoes-section/components/echo-slot-editor"
import {
  BuildCardSectionDialog,
  BuildCardTrigger,
} from "@builder/ui/build-card-section"
import { BuildCatalogPickerDialog } from "@builder/ui/build-catalog-picker"
import { BuildEchoCard } from "@builder/ui/build-echo-card"
import type { EchoDetail } from "@game-data/domain/echo"

type EchoSlotProps = {
  slot: EchoesDataProps
  /** Sonata sets of the echo assigned to the slot. */
  sets: EchoDetail["sets"]
  isMain: boolean
  /** Icon of the selected sonata set, resolved by the section content. */
  setIcon?: string
  progress: EchoProgress
}

/** Editable card for one echo slot. */
export function EchoSlot({
  slot,
  sets,
  isMain,
  setIcon,
  progress,
}: EchoSlotProps) {
  if (!slot.data) {
    return (
      <BuildCatalogPickerDialog
        trigger={
          <BuildCardTrigger>
            <BuildEchoCard slot={slot} isMain={false} />
          </BuildCardTrigger>
        }
        title="Selecciona un eco"
        description={`El eco elegido se asignará al slot ${slot.index + 1}.`}
      >
        {({ close }) => (
          <SkeletonSuspense skeleton={<EchoPickerSkeleton />}>
            <EchoPicker slot={slot} onSelected={close} />
          </SkeletonSuspense>
        )}
      </BuildCatalogPickerDialog>
    )
  }

  return (
    <div className="relative z-20">
      <BuildCardSectionDialog
        title={`Eco ${slot.index + 1}`}
        description="Ajusta el set, la estadística principal y las substats del eco."
        dialogContent={{ size: "lg" }}
        trigger={
          <BuildEchoCard slot={slot} isMain={isMain} setIcon={setIcon} />
        }
      >
        {() => (
          <EchoSlotEditor
            slot={slot}
            sets={sets}
            isMain={isMain}
            progress={progress}
          />
        )}
      </BuildCardSectionDialog>

      <div className="absolute inset-x-0 top-0 z-20 flex -translate-y-1/2 justify-center">
        <EchoPickerDialog slot={slot} />
      </div>
    </div>
  )
}

import type { EchoesDataProps } from "@builds/domain/build-record"
import { SkeletonSuspense } from "skullet/react"
import { BuildCatalogPickerDialog } from "@builder/ui/build-catalog-picker"
import {
  BuildCardSectionDialog,
  BuildCardTrigger,
} from "@builder/ui/build-card-section"
import { EchoPicker } from "@builder/components/build-card/echo-slots-section/echo-picker"
import { EchoPickerDialog } from "@builder/components/build-card/echo-slots-section/echo-picker-dialog"
import { EchoPickerSkeleton } from "@builder/components/build-card/echo-slots-section/echo-picker-skeleton"
import { EchoSlotEditor } from "@builder/components/build-card/echo-slots-section/echo-slot-editor"
import { EchoSlotTrigger } from "@builder/components/build-card/echo-slots-section/echo-slot-trigger"

type EchoSlotSectionProps = {
  slot: EchoesDataProps
  /** Icon of the selected sonata set, resolved by the slots grid. */
  setIcon?: string
}

/** Editable card for one echo slot. */
export function EchoSlotSection({ slot, setIcon }: EchoSlotSectionProps) {
  if (!slot.data) {
    return (
      <BuildCatalogPickerDialog
        trigger={
          <BuildCardTrigger>
            <EchoSlotTrigger slot={slot} />
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
        trigger={<EchoSlotTrigger slot={slot} setIcon={setIcon} />}
      >
        {() => <EchoSlotEditor slot={slot} />}
      </BuildCardSectionDialog>

      <div className="absolute inset-x-0 bottom-4 z-20 flex justify-center">
        <EchoPickerDialog slot={slot} />
      </div>
    </div>
  )
}

import { ResonatorPickerDialog } from "@/modules/panel/user/builder/components/resonator-selector"
import { BuildCardSectionDialog } from "../../../ui/build-card-section"
import { ResonatorInfoEditor } from "./resonator-info-editor"
import { ResonatorInfoTrigger } from "./resonator-info-trigger"

/** Editable card for the resonator level and sequence. */
export function ResonatorInfoSection() {
  return (
    <div className="relative h-full">
      <BuildCardSectionDialog
        title="Info del resonador"
        description="Ajusta el nivel y la secuencia del resonador."
        dialogContent={{ size: "lg" }}
        trigger={<ResonatorInfoTrigger />}
      >
        {() => <ResonatorInfoEditor />}
      </BuildCardSectionDialog>

      <div className="absolute top-3 right-3 z-10">
        <ResonatorPickerDialog />
      </div>
    </div>
  )
}

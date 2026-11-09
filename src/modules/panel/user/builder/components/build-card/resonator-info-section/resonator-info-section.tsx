import { BuildCardSectionDialog } from "../../../ui/build-card-section"
import { ResonatorInfoEditor } from "./resonator-info-editor"
import { ResonatorInfoTrigger } from "./resonator-info-trigger"

/** Editable card for the resonator level and sequence. */
export function ResonatorInfoSection() {
  return (
    <BuildCardSectionDialog
      title="Info del resonador"
      trigger={<ResonatorInfoTrigger />}
    >
      {() => <ResonatorInfoEditor />}
    </BuildCardSectionDialog>
  )
}

import { Separator } from "@/components/ui/separator"
import { ResonatorInfoActions } from "@builder/components/build-card/resonator-info-section/resonator-info-actions"
import { ResonatorSelection } from "@builder/components/build-card/resonator-info-section/resonator-selection"

/** Placeholder body of the resonator info dialog. */
export function ResonatorInfoEditor() {
  return (
    <div className="space-y-6">
      <ResonatorSelection />
      <Separator />
      <ResonatorInfoActions />
    </div>
  )
}

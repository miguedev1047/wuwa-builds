import { Separator } from "@/components/ui/separator"
import { ResonatorInfoActions } from "./resonator-info-actions"
import { ResonatorSelection } from "./resonator-selection"

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

import { Separator } from "@/components/ui/separator"
import { WeaponControls } from "@builder/components/build-card/weapon-section/weapon-controls"
import { WeaponSelection } from "@builder/components/build-card/weapon-section/weapon-selection"

/** Weapon picker and controls rendered inside the section dialog. */
export function WeaponEditor() {
  return (
    <div className="space-y-6">
      <WeaponSelection />
      <Separator />
      <WeaponControls />
    </div>
  )
}

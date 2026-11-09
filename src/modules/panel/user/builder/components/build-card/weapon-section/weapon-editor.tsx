import { WeaponControls } from "./weapon-controls"
import { WeaponSelection } from "./weapon-selection"

/** Weapon picker and controls rendered inside the section dialog. */
export function WeaponEditor() {
  return (
    <div className="space-y-6">
      <WeaponSelection />
      <WeaponControls />
    </div>
  )
}

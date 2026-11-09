import { SkeletonSuspense } from "skullet/react"
import { WeaponPicker } from "./weapon-picker"
import { WeaponPickerSkeleton } from "./weapon-picker-skeleton"
import { WeaponSelected } from "./weapon-selected"

/** Weapon picker and controls rendered inside the section dialog. */
export function WeaponEditor() {
  return (
    <div className="space-y-6">
      <SkeletonSuspense skeleton={<WeaponPickerSkeleton />}>
        <WeaponPicker />
      </SkeletonSuspense>

      <WeaponSelected />
    </div>
  )
}

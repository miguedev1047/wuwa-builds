import { SkeletonBox } from "skullet/react"
import { buildCatalogPickerVariants } from "../../../ui/build-catalog-picker"

/** Square skeleton that mirrors the weapon picker grid. */
export function WeaponPickerSkeleton() {
  return (
    <div className={buildCatalogPickerVariants({ columns: 6 })}>
      {Array.from({ length: 12 }).map((_, index) => (
        <SkeletonBox key={index} className="aspect-square w-full" radius={12} />
      ))}
    </div>
  )
}

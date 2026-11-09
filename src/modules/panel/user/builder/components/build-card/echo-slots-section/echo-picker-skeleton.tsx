import { SkeletonBox } from "skullet/react"
import { buildCatalogPickerVariants } from "../../../ui/build-catalog-picker"

/** Square skeleton that mirrors the echo picker grid. */
export function EchoPickerSkeleton() {
  return (
    <div className={buildCatalogPickerVariants({ columns: 4 })}>
      {Array.from({ length: 8 }).map((_, index) => (
        <SkeletonBox key={index} className="aspect-square w-full" radius={12} />
      ))}
    </div>
  )
}

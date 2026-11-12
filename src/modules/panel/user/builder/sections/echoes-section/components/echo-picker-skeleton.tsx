import { SkeletonBox } from "skullet/react"
import { buildCatalogPickerVariants } from "@builder/ui/build-catalog-picker"

/** Square skeleton that mirrors the echo picker grid. */
export function EchoPickerSkeleton() {
  return (
    <div className={buildCatalogPickerVariants({ columns: 6 })}>
      {Array.from({ length: 12 }).map((_, index) => (
        <SkeletonBox
          key={index}
          className="aspect-square w-full"
          width="100%"
          height="100%"
        />
      ))}
    </div>
  )
}

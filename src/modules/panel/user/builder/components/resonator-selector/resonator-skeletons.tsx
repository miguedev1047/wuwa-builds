import { SkeletonBox } from "skullet/react"
import { cn } from "cn"
import {
  buildCatalogPickerVariants,
  type BuildCatalogPickerColumns,
} from "@builder/ui/build-catalog-picker"
import type { ResonatorAspect } from "@builder/components/resonator-selector/resonator-item"

const SKELETONS_ITEMS = 16

interface ResonatorListLoadingProps {
  count?: number
  columns?: BuildCatalogPickerColumns
  aspect?: ResonatorAspect
}

/** Grid skeleton that mirrors the real resonator grid. */
export function ResonatorListLoading({
  count = SKELETONS_ITEMS,
  columns = 8,
  aspect = "portrait",
}: ResonatorListLoadingProps) {
  const skeletons = Array.from({ length: count })
  const aspectClass = aspect === "portrait" ? "aspect-2/3!" : "aspect-square!"

  return (
    <ul className={cn(buildCatalogPickerVariants({ columns }))}>
      {skeletons.map((_, index) => (
        <li key={index} className="min-w-0">
          <SkeletonBox className={cn("size-full!", aspectClass)} />
        </li>
      ))}
    </ul>
  )
}

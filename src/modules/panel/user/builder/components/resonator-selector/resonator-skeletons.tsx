import { SkeletonBox } from "skullet/react"
import { cn } from "cn"
import {
  resonatorGridVariants,
  type ResonatorGridColumns,
} from "@/modules/panel/user/builder/components/resonator-selector"
import type { ResonatorAspect } from "@/modules/panel/user/builder/components/resonator-selector/resonator-item"

const SKELETONS_ITEMS = 16

interface ResonatorListLoadingProps {
  count?: number
  columns?: ResonatorGridColumns
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
    <ul className={cn(resonatorGridVariants({ columns }))}>
      {skeletons.map((_, index) => (
        <li key={index} className="min-w-0">
          <SkeletonBox className={cn("size-full!", aspectClass)} />
        </li>
      ))}
    </ul>
  )
}

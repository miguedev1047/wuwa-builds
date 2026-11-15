import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "cn"
import {
  buildCatalogPickerVariants,
  type BuildCatalogPickerColumns,
} from "@build/presentation/components/build-catalog-picker"
import { Separator } from "@/components/ui/separator"

interface WeaponLoadingProps {
  columns?: BuildCatalogPickerColumns
}

const PICKER_COLUMNS = 4
const BASE_STATS = 2

/** Square skeleton that mirrors the weapon picker grid. */
export function WeaponPickerLoading({
  columns = PICKER_COLUMNS,
}: WeaponLoadingProps = {}) {
  return (
    <div className={cn(buildCatalogPickerVariants({ columns }))}>
      {Array.from({ length: columns * 2 }).map((_, index) => (
        <Skeleton key={index} className="aspect-square" />
      ))}
    </div>
  )
}

/** Placeholder that mirrors the layout of the weapon section. */
export function WeaponSectionLoading() {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <div className="flex w-full items-center justify-between">
        <Skeleton className="h-7 w-40" />
        <Skeleton className="size-9 rounded-full" />
      </div>

      <div className="flex h-full w-full flex-col justify-between gap-5">
        <div className="flex items-center gap-4">
          <Skeleton className="aspect-square size-32" />
          <div className="space-y-1">
            <Skeleton className="h-9 w-40" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-18" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-30" />
          <div className="grid grid-cols-1 items-center gap-1">
            {Array.from({ length: BASE_STATS }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-full" />
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <Skeleton className="h-5 w-30" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-5 w-30" />
          <Skeleton className="h-50 w-full" />
        </div>
      </div>
    </div>
  )
}

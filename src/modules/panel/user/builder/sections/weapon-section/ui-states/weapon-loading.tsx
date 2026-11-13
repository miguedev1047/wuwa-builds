import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "cn"
import {
  buildCatalogPickerVariants,
  type BuildCatalogPickerColumns,
} from "@builder/ui/build-catalog-picker"
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
    <div className="space-y-4">
      <div className="flex w-full flex-col items-start gap-4 md:flex-row">
        <Skeleton className="aspect-square w-full shrink-0 sm:w-64" />

        <div className="flex w-full flex-col gap-6">
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-70" />
            <Skeleton className="size-7" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-7 w-18" />
            <Skeleton className="h-3 w-full" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-7 w-40" />
            <div className="flex flex-wrap items-center gap-4">
              {Array.from({ length: BASE_STATS }).map((_, index) => (
                <Skeleton key={index} className="h-18 min-w-64 flex-1" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex items-start gap-8">
          <div className="flex shrink-0 items-center gap-4">
            <Skeleton className="size-9" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="size-9" />
          </div>

          <div className="w-full space-y-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  )
}

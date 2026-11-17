import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

const SKILLS = 5
const PASSIVES = 10
const BASE_STATS = 3
const SEQUENCES = 6

/** Placeholder that mirrors the layout of the resonator section. */
export function ResonatorSectionLoading() {
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
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
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
        <div className="space-y-2">
          <Skeleton className="h-5 w-30" />
          <div className="grid grid-cols-6 items-center gap-1">
            {Array.from({ length: SEQUENCES }).map((_, index) => (
              <Skeleton key={index} className="aspect-square" />
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <Skeleton className="h-5 w-30" />
          <div className="grid grid-cols-1 items-center gap-1">
            {Array.from({ length: SKILLS }).map((_, index) => (
              <div className="flex w-full items-end gap-2" key={index}>
                <Skeleton className="size-14 shrink-0" />
                <div className="w-full space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <Skeleton className="h-5 w-30" />
          <ul className="grid grid-cols-5 gap-2">
            {Array.from({ length: PASSIVES }).map((_, index) => (
              <Skeleton key={index} className="aspect-square" />
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

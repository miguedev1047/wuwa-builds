import { Skeleton } from "@/components/ui/skeleton"

const BASE_STATS = 3
const SEQUENCES = 6

/** Placeholder that mirrors the layout of the resonator section. */
export function ResonatorSectionSkeleton() {
  return (
    <div className="flex w-full flex-col items-start gap-4 md:h-96 md:flex-row">
      <Skeleton className="aspect-2/3 w-full shrink-0 sm:w-64" />

      <div className="flex w-full flex-col justify-between gap-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-7 w-7" />
          <Skeleton className="h-7 w-35" />
          <Skeleton className="h-7 w-7" />
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

        <div className="space-y-2">
          <Skeleton className="h-7 w-30" />

          <div className="flex items-center gap-8">
            {Array.from({ length: SEQUENCES }).map((_, index) => (
              <Skeleton key={index} className="h-14.5 w-14.5" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

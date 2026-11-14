import { Skeleton } from "@/components/ui/skeleton"

/** Row skeleton that mirrors the stats list. */
export function StatsSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-25" />

      <div className="grid gap-x-8 gap-y-3 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="h-5 w-full" />
        ))}
      </div>
    </div>
  )
}

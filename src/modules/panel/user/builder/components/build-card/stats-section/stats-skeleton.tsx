import { SkeletonBox } from "skullet/react"

/** Row skeleton that mirrors the stats list. */
export function StatsSkeleton() {
  return (
    <div className="grid gap-x-8 gap-y-3 sm:grid-flow-col sm:grid-cols-2 sm:grid-rows-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <SkeletonBox key={index} width="100%" height={16} radius={0} />
      ))}
    </div>
  )
}

import { SkeletonBox } from "skullet/react"

export function SequenciesSkeleton() {
  return (
    <div className="grid gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonBox
          key={index}
          width="100%"
          height="100%"
          className="size-12!"
        />
      ))}
    </div>
  )
}

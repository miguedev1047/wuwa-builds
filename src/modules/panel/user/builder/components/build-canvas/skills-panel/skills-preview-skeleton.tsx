import { SkeletonBox } from "skullet/react"

/** Skeleton that mirrors the skills and passives preview. */
export function SkillsPreviewSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <SkeletonBox width={150} height={16} />
        <SkeletonBox width={70} height={16} />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-5 content-center gap-2">
        {Array.from({ length: 5 }).map((_, row) => (
          <SkeletonBox
            key={row}
            width="100%"
            height="100%"
            className="aspect-square"
          />
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <SkeletonBox width={120} height={16} />
        <SkeletonBox width={32} height={16} />
      </div>
    </div>
  )
}

import { SkeletonBox } from "skullet/react"

/** Skeleton for the skills and passives lists. */
export function SkillsEditorSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid w-full gap-4 md:grid-cols-2">
          <SkeletonBox width="100%" height={29} />
          <SkeletonBox width="100%" height={29} />
        </div>

        {Array.from({ length: 5 }).map((_, row) => (
          <SkeletonBox key={row} width="100%" height={74} />
        ))}
      </div>
    </div>
  )
}

export function SkillsTriggerSkeleton() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <SkeletonBox width={150} height={16} />
        <SkeletonBox width={70} height={16} />
      </div>

      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-5">
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

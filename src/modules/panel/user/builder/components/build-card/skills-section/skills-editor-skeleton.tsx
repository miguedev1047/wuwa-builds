import { SkeletonBox } from "skullet/react"

/** Skeleton for the skills and passives lists. */
export function SkillsEditorSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 2 }).map((_, section) => (
        <div key={section} className="space-y-2">
          <SkeletonBox width={120} height={16} radius={0} />
          {Array.from({ length: 3 }).map((_, row) => (
            <SkeletonBox key={row} width="100%" height={56} radius={8} />
          ))}
        </div>
      ))}
    </div>
  )
}

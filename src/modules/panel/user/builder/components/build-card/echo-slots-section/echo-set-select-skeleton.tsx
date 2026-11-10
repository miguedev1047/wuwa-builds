import { SkeletonBox } from "skullet/react"

export function EchoSetSelectSkeleton() {
  return (
    <div className="space-y-2">
      <SkeletonBox width={40} height={16} />
      <SkeletonBox width="100%" height={36} />
    </div>
  )
}

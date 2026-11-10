import { SkeletonBox } from "skullet/react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"

export function EchoSkillSkeleton() {
  return (
    <EditableSection.Content>
      <div className="flex gap-4">
        <SkeletonBox width={64} height={64} radius={8} />

        <div className="flex flex-1 flex-col gap-2">
          <SkeletonBox width="90%" height={12} />
          <SkeletonBox width="80%" height={12} />
          <SkeletonBox width="60%" height={12} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <SkeletonBox width="100%" height={48} radius={8} />
        <SkeletonBox width="100%" height={48} radius={8} />
      </div>
    </EditableSection.Content>
  )
}

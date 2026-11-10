import { SkeletonBox } from "skullet/react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"

export function PropertyLevelsSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-2">
        <SkeletonBox width="100%" height={48} radius={0} />
        <SkeletonBox width="100%" height={48} radius={0} />
        <SkeletonBox width="100%" height={48} radius={0} />
      </div>
    </EditableSection.Content>
  )
}

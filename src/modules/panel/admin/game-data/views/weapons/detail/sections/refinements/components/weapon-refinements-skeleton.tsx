import { SkeletonBox } from "skullet/react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"

export function WeaponRefinementsSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-4">
        <SkeletonBox width="100%" height={180} radius={0} />
        <SkeletonBox width="100%" height={180} radius={0} />
      </div>
    </EditableSection.Content>
  )
}

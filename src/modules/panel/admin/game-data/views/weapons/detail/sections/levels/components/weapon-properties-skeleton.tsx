import { SkeletonBox } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"

export function WeaponPropertiesSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-2">
        <SkeletonBox width="100%" height={48} radius={0} />
        <SkeletonBox width="100%" height={48} radius={0} />
      </div>
    </EditableSection.Content>
  )
}

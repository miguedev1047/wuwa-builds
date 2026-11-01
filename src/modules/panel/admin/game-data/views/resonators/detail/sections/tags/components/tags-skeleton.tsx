import { SkeletonBox } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"

export function ResonatorTagsSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-2">
        <SkeletonBox width="7rem" height={16.5} />
        <SkeletonBox width="100%" height={28} radius={0} />

        <SkeletonBox width="100%" height={48} radius={0} />
      </div>
    </EditableSection.Content>
  )
}

import { SkeletonBox } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"

export function ResonatorPassivesSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-4">
        <SkeletonBox width="100%" height={140} radius={8} />
        <SkeletonBox width="100%" height={140} radius={8} />
      </div>
    </EditableSection.Content>
  )
}

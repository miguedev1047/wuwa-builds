import { SkeletonBox } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"

export function ResonatorTagsSkeleton() {
  return (
    <EditableSection.Content>
      <div className="flex flex-wrap gap-2">
        <SkeletonBox width="5rem" height={20} radius={999} />
        <SkeletonBox width="6rem" height={20} radius={999} />
        <SkeletonBox width="4rem" height={20} radius={999} />
      </div>
    </EditableSection.Content>
  )
}

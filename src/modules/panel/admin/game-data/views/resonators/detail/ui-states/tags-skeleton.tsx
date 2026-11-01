import { SkeletonBox } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"

export function ResonatorTagsSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-2">
        <SkeletonBox width="7rem" height={12} />
        <SkeletonBox width="100%" height={28} radius={6} />
      </div>

      <div className="mt-4 flex justify-end">
        <SkeletonBox width="4.5rem" height={24} radius={6} />
      </div>
    </EditableSection.Content>
  )
}

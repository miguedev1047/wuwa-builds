import { SkeletonBox } from "skullet/react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"

export function EchoSetsSkeleton() {
  return (
    <EditableSection.Content>
      <div className="flex flex-col gap-2">
        <SkeletonBox width="100%" height={56} radius={8} />
        <SkeletonBox width="100%" height={56} radius={8} />
      </div>
    </EditableSection.Content>
  )
}

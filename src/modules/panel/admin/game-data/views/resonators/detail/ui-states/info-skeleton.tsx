import { SkeletonBox } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"

export function ResonatorInfoSkeleton() {
  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <SkeletonBox width="12rem" height={24} />
      </EditableSection.Header>

      <EditableSection.Content className="flex w-full flex-col items-start gap-4 md:flex-row">
        <SkeletonBox width={160} height={240} radius={6} />

        <div className="flex flex-1 flex-col gap-3">
          <SkeletonBox width="40%" height={32} />
          <SkeletonBox width="100%" height={12} />
          <SkeletonBox width="90%" height={12} />
          <SkeletonBox width="70%" height={12} />
        </div>
      </EditableSection.Content>
    </EditableSection.Root>
  )
}

import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"

export function ResonatorMediaSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-2">
        <Skeleton className="h-16 w-full rounded-none" />
        <Skeleton className="h-16 w-full rounded-none" />
        <Skeleton className="h-16 w-full rounded-none" />
      </div>
    </EditableSection.Content>
  )
}

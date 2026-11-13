import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"

export function ResonatorTagsSkeleton() {
  return (
    <EditableSection.Content>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-5 w-full rounded-none" />
        <Skeleton className="h-5 w-full rounded-none" />
        <Skeleton className="h-5 w-full rounded-none" />
      </div>
    </EditableSection.Content>
  )
}

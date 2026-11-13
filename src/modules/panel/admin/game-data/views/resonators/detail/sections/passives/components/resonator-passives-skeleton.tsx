import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"

export function ResonatorPassivesSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-4">
        <Skeleton className="h-35 w-full rounded-lg" />
        <Skeleton className="h-35 w-full rounded-lg" />
      </div>
    </EditableSection.Content>
  )
}

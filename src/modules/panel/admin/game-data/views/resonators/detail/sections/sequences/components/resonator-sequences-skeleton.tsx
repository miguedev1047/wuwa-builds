import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"

export function ResonatorSequencesSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-4">
        <Skeleton className="h-35 w-full rounded-none" />
        <Skeleton className="h-35 w-full rounded-none" />
      </div>
    </EditableSection.Content>
  )
}

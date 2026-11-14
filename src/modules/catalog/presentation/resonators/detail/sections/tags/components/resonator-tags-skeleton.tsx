import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"

export function ResonatorTagsSkeleton() {
  return (
    <EditableSection.Content>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-5 w-full rounded-lg" />
        <Skeleton className="h-5 w-full rounded-lg" />
        <Skeleton className="h-5 w-full rounded-lg" />
      </div>
    </EditableSection.Content>
  )
}

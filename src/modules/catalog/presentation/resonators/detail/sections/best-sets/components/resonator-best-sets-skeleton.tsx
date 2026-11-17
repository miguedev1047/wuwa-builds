import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"

/** Loading rows matching the ranked Sonata set list. */
export function ResonatorBestSetsSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-2">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    </EditableSection.Content>
  )
}

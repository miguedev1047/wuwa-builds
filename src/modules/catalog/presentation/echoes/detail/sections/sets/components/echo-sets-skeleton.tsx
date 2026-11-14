import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"

export function EchoSetsSkeleton() {
  return (
    <EditableSection.Content>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-14 w-full rounded-lg" />
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    </EditableSection.Content>
  )
}

import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"

export function EchoSkillSkeleton() {
  return (
    <EditableSection.Content>
      <div className="flex gap-4">
        <Skeleton className="size-16 rounded-lg" />

        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-9/10" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </EditableSection.Content>
  )
}

import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"

export function ResonatorInfoSkeleton() {
  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <Skeleton className="h-8 w-48" />

        <EditableSection.Action>
          <Skeleton className="h-7 w-18" />
          <Skeleton className="size-7" />
        </EditableSection.Action>
      </EditableSection.Header>

      <EditableSection.Content className="flex w-full flex-col items-start gap-4 md:flex-row">
        <Skeleton className="h-60 w-40 rounded-lg" />

        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-8 w-2/5" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-9/10" />
          <Skeleton className="h-3 w-7/10" />
        </div>
      </EditableSection.Content>
    </EditableSection.Root>
  )
}

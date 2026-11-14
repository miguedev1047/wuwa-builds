import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"

export function ResonatorSkillsSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-4">
        <Skeleton className="h-35 w-full rounded-lg" />
        <Skeleton className="h-35 w-full rounded-lg" />
      </div>
    </EditableSection.Content>
  )
}

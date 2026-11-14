import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"

export function WeaponPropertiesSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </EditableSection.Content>
  )
}

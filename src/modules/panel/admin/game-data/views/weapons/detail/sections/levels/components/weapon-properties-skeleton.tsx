import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"

export function WeaponPropertiesSkeleton() {
  return (
    <EditableSection.Content>
      <div className="space-y-2">
        <Skeleton className="h-12 w-full rounded-none" />
        <Skeleton className="h-12 w-full rounded-none" />
      </div>
    </EditableSection.Content>
  )
}

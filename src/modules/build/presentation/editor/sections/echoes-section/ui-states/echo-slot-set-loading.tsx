import { Skeleton } from "@/components/ui/skeleton"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

/** Loading state for the selected echo's sonata set field. */
export function EchoSlotSetLoading() {
  return (
    <div className="space-y-2" aria-busy="true">
      <BuildWorkspace.Text size="sm">Set</BuildWorkspace.Text>
      <Skeleton className="h-9 w-full" />
    </div>
  )
}

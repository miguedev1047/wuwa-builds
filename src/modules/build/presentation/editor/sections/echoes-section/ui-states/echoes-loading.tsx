import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

/** Placeholder for the selected echo editor. */
export function EchoSlotLoading() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="size-5" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="size-32" />
          <div className="space-y-1">
            <Skeleton className="h-5 w-25" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-10" />
          </div>
        </div>
      </div>
      <Separator />
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-28" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8.75 w-56" />
          <Skeleton className="h-8.75 flex-1" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8.75 w-56" />
          <Skeleton className="h-8.75 flex-1" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8.75 w-56" />
          <Skeleton className="h-8.75 flex-1" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8.75 w-56" />
          <Skeleton className="h-8.75 flex-1" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8.75 w-56" />
          <Skeleton className="h-8.75 flex-1" />
        </div>
      </div>
      <div>
        <Skeleton className="h-12.75 w-full" />
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

/** Skeleton that mirrors the skills and passives preview. */
export function SkillsPreviewSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-4 w-37.5" />
        <Skeleton className="h-4 w-17.5" />
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-5 content-center gap-2">
        {Array.from({ length: 5 }).map((_, row) => (
          <Skeleton key={row} className="aspect-square size-full" />
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 text-xs text-muted-foreground">
        <Skeleton className="h-4 w-30" />
        <Skeleton className="h-4 w-8" />
      </div>
    </div>
  )
}

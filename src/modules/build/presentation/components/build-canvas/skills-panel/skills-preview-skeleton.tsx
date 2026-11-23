import { Skeleton } from "@/components/ui/skeleton"

/** Loading state with the same five branches as the skills preview. */
export function SkillsPreviewSkeleton() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-3">
      <Skeleton className="h-4 w-37.5" />
      <div className="grid min-h-0 flex-1 grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center justify-end">
            <div className="flex flex-1 flex-col justify-evenly gap-3 pb-3">
              <Skeleton className="size-7 rounded-full" />
              <Skeleton className="size-7 rounded-full" />
            </div>
            <Skeleton className="size-14 rounded-md" />
            <Skeleton className="mt-2 h-4 w-10" />
          </div>
        ))}
      </div>
    </div>
  )
}

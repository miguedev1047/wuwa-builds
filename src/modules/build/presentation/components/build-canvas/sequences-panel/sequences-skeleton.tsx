import { Skeleton } from "@/components/ui/skeleton"

export function SequencesSkeleton() {
  return (
    <div className="grod-cols-4 grid gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="size-12" />
      ))}
    </div>
  )
}

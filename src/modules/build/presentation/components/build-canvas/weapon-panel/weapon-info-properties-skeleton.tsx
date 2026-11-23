import { Skeleton } from "@/components/ui/skeleton"

/** Two property pills that mirror the weapon properties grid. */
export function WeaponInfoPropertiesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-full rounded-xl" />
      ))}
    </div>
  )
}

import { SkeletonBox } from "skullet/react"

/** Two property pills that mirror the weapon properties grid. */
export function WeaponInfoPropertiesSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <SkeletonBox key={index} width="100%" height={40} radius={12} />
      ))}
    </div>
  )
}

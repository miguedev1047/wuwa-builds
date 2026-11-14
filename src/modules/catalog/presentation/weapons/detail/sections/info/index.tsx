import { Suspense } from "react"
import { WeaponInfoContent } from "@catalog/presentation/weapons/detail/sections/info/components/weapon-info-content"
import { WeaponInfoSkeleton } from "@catalog/presentation/weapons/detail/sections/info/components/weapon-info-skeleton"

/** Summary (`weapons`) of the weapon. */
export function WeaponInfoSection({ weaponId }: { weaponId: number }) {
  return (
    <Suspense fallback={<WeaponInfoSkeleton />}>
      <WeaponInfoContent weaponId={weaponId} />
    </Suspense>
  )
}

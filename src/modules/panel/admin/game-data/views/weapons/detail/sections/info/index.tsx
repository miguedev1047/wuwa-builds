import { useParams } from "@tanstack/react-router"
import { Suspense } from "react"
import { WeaponInfoContent } from "@panel/admin/game-data/views/weapons/detail/sections/info/components/weapon-info-content"
import { WeaponInfoSkeleton } from "@panel/admin/game-data/views/weapons/detail/sections/info/components/weapon-info-skeleton"

/** Summary (`weapons`) of the weapon. */
export function WeaponInfoSection() {
  const { id } = useParams({ from: "/(panel)/admin/weapons/$id" })
  const weaponId = Number(id)

  return (
    <Suspense fallback={<WeaponInfoSkeleton />}>
      <WeaponInfoContent weaponId={weaponId} />
    </Suspense>
  )
}

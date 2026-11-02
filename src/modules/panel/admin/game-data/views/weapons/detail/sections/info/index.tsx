import { useParams } from "@tanstack/react-router"
import { SkeletonSuspense } from "skullet/react"
import { WeaponInfoContent } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/info/components/weapon-info-content"
import { WeaponInfoSkeleton } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/info/components/weapon-info-skeleton"

/** Summary (`weapons`) of the weapon. */
export function WeaponInfoSection() {
  const { id } = useParams({ from: "/(panel)/admin/weapons/$id" })
  const weaponId = Number(id)

  return (
    <SkeletonSuspense skeleton={<WeaponInfoSkeleton />}>
      <WeaponInfoContent weaponId={weaponId} />
    </SkeletonSuspense>
  )
}

import { useParams } from "@tanstack/react-router"
import { SkeletonBox, SkeletonSuspense } from "skullet/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { WeaponRefinementAddLoader } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinement-add-loader"
import { WeaponRefinementsContent } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinements-content"
import { WeaponRefinementsSkeleton } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinements-skeleton"

/** Refinements (`weapon_refinements`) of the weapon and their stats. */
export function WeaponRefinementsSection() {
  const { id } = useParams({ from: "/(panel)/admin/weapons/$id" })
  const weaponId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Refinamientos</EditableSection.Title>

        <EditableSection.Description>
          Efectos del arma por rango y las estadísticas que otorgan.
        </EditableSection.Description>

        <EditableSection.Action>
          <SkeletonSuspense
            skeleton={<SkeletonBox width="10rem" height={32} />}
          >
            <WeaponRefinementAddLoader weaponId={weaponId} />
          </SkeletonSuspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <SkeletonSuspense skeleton={<WeaponRefinementsSkeleton />}>
        <WeaponRefinementsContent weaponId={weaponId} />
      </SkeletonSuspense>
    </EditableSection.Root>
  )
}

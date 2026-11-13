import { useParams } from "@tanstack/react-router"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { WeaponRefinementAddLoader } from "@panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinement-add-loader"
import { WeaponRefinementsContent } from "@panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinements-content"
import { WeaponRefinementsSkeleton } from "@panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinements-skeleton"

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
          <Suspense fallback={<Skeleton className="h-8 w-40" />}>
            <WeaponRefinementAddLoader weaponId={weaponId} />
          </Suspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <Suspense fallback={<WeaponRefinementsSkeleton />}>
        <WeaponRefinementsContent weaponId={weaponId} />
      </Suspense>
    </EditableSection.Root>
  )
}

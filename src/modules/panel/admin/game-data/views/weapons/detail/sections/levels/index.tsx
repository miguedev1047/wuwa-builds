import { useParams } from "@tanstack/react-router"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { WeaponPropertiesList } from "@panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-properties-list"
import { WeaponPropertiesSkeleton } from "@panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-properties-skeleton"
import { WeaponPropertyAddLoader } from "@panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-property-add-loader"

/** Properties (`weapon_properties`) of the weapon. */
export function WeaponLevelsSection() {
  const { id } = useParams({ from: "/(panel)/admin/weapons/$id" })
  const weaponId = Number(id)

  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Niveles</EditableSection.Title>

        <EditableSection.Description>
          Propiedades base del arma y sus valores por nivel.
        </EditableSection.Description>

        <EditableSection.Action>
          <Suspense fallback={<Skeleton className="h-8 w-24" />}>
            <WeaponPropertyAddLoader weaponId={weaponId} />
          </Suspense>
        </EditableSection.Action>
      </EditableSection.Header>

      <Suspense fallback={<WeaponPropertiesSkeleton />}>
        <WeaponPropertiesList weaponId={weaponId} />
      </Suspense>
    </EditableSection.Root>
  )
}

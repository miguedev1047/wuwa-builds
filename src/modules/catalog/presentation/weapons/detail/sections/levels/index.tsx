import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { WeaponPropertiesList } from "@catalog/presentation/weapons/detail/sections/levels/components/weapon-properties-list"
import { WeaponPropertiesSkeleton } from "@catalog/presentation/weapons/detail/sections/levels/components/weapon-properties-skeleton"
import { WeaponPropertyAddLoader } from "@catalog/presentation/weapons/detail/sections/levels/components/weapon-property-add-loader"

/** Properties (`weapon_properties`) of the weapon. */
export function WeaponLevelsSection({ weaponId }: { weaponId: number }) {
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

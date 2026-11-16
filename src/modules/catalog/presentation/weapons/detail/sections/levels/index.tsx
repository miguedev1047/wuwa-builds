import { Skeleton } from "@/components/ui/skeleton"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { WeaponPropertiesList } from "@catalog/presentation/weapons/detail/sections/levels/components/weapon-properties-list"
import { WeaponPropertiesSkeleton } from "@catalog/presentation/weapons/detail/sections/levels/components/weapon-properties-skeleton"
import { WeaponPropertyAddLoader } from "@catalog/presentation/weapons/detail/sections/levels/components/weapon-property-add-loader"
import { Suspense } from "react"

/** Properties (`weapon_properties`) of the weapon. */
export function WeaponLevelsSection({ weaponId }: { weaponId: number }) {
  return (
    <EditableSection.Root>
      <EditableSection.Header>
        <EditableSection.Title>Niveles</EditableSection.Title>

        <EditableSection.Description>
          Propiedades base del arma y sus valores por nivel.
        </EditableSection.Description>

        <EditableSection.Actions>
          <Suspense fallback={<Skeleton className="h-8 w-24" />}>
            <WeaponPropertyAddLoader weaponId={weaponId} />
          </Suspense>
        </EditableSection.Actions>
      </EditableSection.Header>

      <Suspense fallback={<WeaponPropertiesSkeleton />}>
        <WeaponPropertiesList weaponId={weaponId} />
      </Suspense>
    </EditableSection.Root>
  )
}

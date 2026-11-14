import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreWeaponQueries } from "@encore/queries/catalogs"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { weaponQueries } from "@catalog/queries/weapons"
import { findEncoreWeaponProperty } from "@catalog/presentation/weapons/detail/application/weapon-property-draft"
import { WeaponPropertyRow } from "@catalog/presentation/weapons/detail/sections/levels/components/weapon-property-row"

type WeaponPropertiesListProps = {
  weaponId: number
}

/** Suspended list of the weapon base stats. */
export function WeaponPropertiesList({ weaponId }: WeaponPropertiesListProps) {
  const { data: weapon } = useSuspenseQuery(weaponQueries.detail(weaponId))
  const { data: encoreWeapon } = useSuspenseQuery(
    encoreWeaponQueries.detail(weaponId)
  )

  return (
    <EditableSection.Content>
      <EditableSection.List
        items={weapon.properties}
        getItemKey={(property) => property.id}
        empty={
          <EditableSection.Text>
            Sin propiedades agregadas.
          </EditableSection.Text>
        }
      >
        {(property) => (
          <WeaponPropertyRow
            property={property}
            weaponId={weaponId}
            encoreProperty={findEncoreWeaponProperty(
              encoreWeapon.properties,
              property.name
            )}
          />
        )}
      </EditableSection.List>
    </EditableSection.Content>
  )
}

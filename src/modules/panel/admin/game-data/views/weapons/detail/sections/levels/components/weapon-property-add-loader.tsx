import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreWeaponQueries } from "@encore/queries/catalogs"
import { weaponQueries } from "@game-data/queries/weapons"
import { weaponPropertyDraftFromEncore } from "@panel/admin/game-data/views/weapons/detail/application/weapon-property-draft"
import { WeaponPropertyAddAction } from "@panel/admin/game-data/views/weapons/detail/sections/levels/components/weapon-property-add-action"

type WeaponPropertyAddLoaderProps = {
  weaponId: number
}

/** Small suspended action of the section header. */
export function WeaponPropertyAddLoader({
  weaponId,
}: WeaponPropertyAddLoaderProps) {
  const { data: weapon } = useSuspenseQuery(weaponQueries.detail(weaponId))
  const { data: encoreWeapon } = useSuspenseQuery(
    encoreWeaponQueries.detail(weaponId)
  )

  const savedNames = weapon.properties.map((property) => property.name)
  const drafts = encoreWeapon.properties.map(weaponPropertyDraftFromEncore)
  const isMaxProperties =
    drafts.length > 0 &&
    drafts.every((draft) => savedNames.includes(draft.name))

  const sortOrder =
    weapon.properties.reduce(
      (max, property) => Math.max(max, property.sortOrder),
      0
    ) + 1

  return (
    <WeaponPropertyAddAction
      weaponId={weaponId}
      sortOrder={sortOrder}
      isMaxProperties={isMaxProperties}
      encoreProperties={encoreWeapon.properties}
      savedNames={savedNames}
    />
  )
}

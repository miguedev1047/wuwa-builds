import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreWeaponQueries } from "@encore/queries/catalogs"
import { weaponQueries } from "@catalog/queries/weapons"
import { WeaponRefinementAddAction } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-add-action"

type WeaponRefinementAddLoaderProps = {
  weaponId: number
}

/** Small suspended action of the refinements section header. */
export function WeaponRefinementAddLoader({
  weaponId,
}: WeaponRefinementAddLoaderProps) {
  const { data: weapon } = useSuspenseQuery(weaponQueries.detail(weaponId))
  const { data: encoreWeapon } = useSuspenseQuery(
    encoreWeaponQueries.detail(weaponId)
  )

  const savedRanks = weapon.refinements.map(
    (refinement) => refinement.sortOrder
  )
  const isMaxRefinements =
    encoreWeapon.refinements.length > 0 &&
    encoreWeapon.refinements.every((refinement) =>
      savedRanks.includes(refinement.rank)
    )

  const sortOrder =
    weapon.refinements.reduce(
      (max, refinement) => Math.max(max, refinement.sortOrder),
      0
    ) + 1

  return (
    <WeaponRefinementAddAction
      weaponId={weaponId}
      sortOrder={sortOrder}
      isMaxRefinements={isMaxRefinements}
      encoreRefinements={encoreWeapon.refinements}
      savedRanks={savedRanks}
    />
  )
}

import { useSuspenseQuery } from "@tanstack/react-query"
import { characterQueries } from "@catalog/queries/characters"
import { weaponQueries } from "@catalog/queries/weapons"
import { compatibleBestWeaponOptions } from "@catalog/presentation/resonators/detail/application/best-weapons"
import { ResonatorBestWeaponsEditAction } from "@catalog/presentation/resonators/detail/sections/best-weapons/components/resonator-best-weapons-edit-action"

type ResonatorBestWeaponsEditLoaderProps = {
  resonatorId: number
}

/** Loads the current ranking and canonical catalog options for the editor. */
export function ResonatorBestWeaponsEditLoader({
  resonatorId,
}: ResonatorBestWeaponsEditLoaderProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { data: weapons } = useSuspenseQuery(weaponQueries.list())

  return (
    <ResonatorBestWeaponsEditAction
      resonatorId={resonatorId}
      weaponIds={resonator.bestWeapons.map(({ weaponId }) => String(weaponId))}
      options={compatibleBestWeaponOptions(weapons, resonator.weaponType)}
    />
  )
}

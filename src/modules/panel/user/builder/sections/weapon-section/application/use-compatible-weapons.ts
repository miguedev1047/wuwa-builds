import { useSuspenseQuery } from "@tanstack/react-query"
import { weaponTypeMatches } from "@game-data/application/weapons/types"
import { weaponQueries } from "@game-data/queries/weapons"
import { useBuildCollection } from "@panel/user/builds/application/build-live-queries"

/**
 * Weapons the selected resonator can equip.
 *
 * It also returns the current build selection so a picker can mark it without
 * reading the collection again.
 */
export function useCompatibleWeapons(buildId: string) {
  const { data: weapons } = useSuspenseQuery(weaponQueries.list())
  const { data: build } = useBuildCollection({ buildId })

  const resonatorType = build?.resonator.data?.weaponType ?? ""

  return {
    items: weapons.filter((weapon) =>
      weaponTypeMatches(resonatorType, weapon.type)
    ),
    selectedId: build?.weapon.data?.id,
  }
}

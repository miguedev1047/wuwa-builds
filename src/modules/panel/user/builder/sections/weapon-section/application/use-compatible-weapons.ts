import type { BuildProps } from "@builds/domain/build-record"
import { useSuspenseQuery } from "@tanstack/react-query"
import { weaponTypeMatches } from "@game-data/application/weapons/types"
import { weaponQueries } from "@game-data/queries/weapons"

/**
 * Weapons the selected resonator can equip.
 *
 * It also returns the current build selection so a picker can mark it without
 * reading the collection again.
 */
export function useCompatibleWeapons(build: BuildProps) {
  const { data: weapons } = useSuspenseQuery(weaponQueries.list())

  const resonatorType = build.resonator.data?.weaponType ?? ""

  return {
    items: weapons.filter((weapon) =>
      weaponTypeMatches(resonatorType, weapon.type)
    ),
    selectedId: build.weapon.data?.id,
  }
}

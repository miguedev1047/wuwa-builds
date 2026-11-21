import type { BuildProps } from "@build/domain/build-record"
import { useSelectWeapon } from "@build/presentation/editor/hooks/use-select-weapon"
import { WeaponBuildSearch } from "@build/presentation/editor/searches/weapons"

type WeaponActionsProps = {
  build: BuildProps
}

/** Binds the weapon picker to the current build. */
export function WeaponActions({ build }: WeaponActionsProps) {
  const { selectWeapon } = useSelectWeapon()

  return (
    <WeaponBuildSearch
      selectedWeaponId={build.weapon.data?.id}
      weaponType={build.resonator.data?.weaponType}
      onSelect={selectWeapon}
    />
  )
}

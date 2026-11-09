import { useSuspenseQuery } from "@tanstack/react-query"
import { weaponQueries } from "@/modules/game-data/queries/weapons"
import { weaponTypeMatches } from "@/modules/game-data/application/weapons/types"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { useSelectWeapon } from "../../../application/use-select-weapon"
import {
  BuildCatalogPicker,
  BuildCatalogPickerItem,
} from "../../../ui/build-catalog-picker"

type WeaponPickerProps = {
  /** Called after the weapon is applied to the build. */
  onSelected?: () => void
}

/** Weapons compatible with the selected resonator. */
export function WeaponPicker({ onSelected }: WeaponPickerProps) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })
  const { data: weapons } = useSuspenseQuery(weaponQueries.list())
  const { selectWeapon } = useSelectWeapon(buildId)

  const resonatorType = build?.resonator.data?.weaponType ?? ""
  const compatibleWeapons = weapons.filter((weapon) =>
    weaponTypeMatches(resonatorType, weapon.type)
  )
  const selectedId = build?.weapon.data?.id

  return (
    <BuildCatalogPicker
      items={compatibleWeapons}
      getItemKey={(weapon) => weapon.id}
      columns={4}
      emptyMessage="No hay armas compatibles con el resonador."
    >
      {(weapon) => (
        <BuildCatalogPickerItem
          label={weapon.name}
          image={weapon.icon}
          aspect="square"
          selected={weapon.id === selectedId}
          onSelect={() => {
            void selectWeapon(weapon).then((selected) => {
              if (selected) onSelected?.()
            })
          }}
        />
      )}
    </BuildCatalogPicker>
  )
}

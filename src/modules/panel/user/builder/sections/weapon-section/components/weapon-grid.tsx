import { Suspense } from "react"
import { useCompatibleWeapons } from "@builder/sections/weapon-section/application/use-compatible-weapons"
import {
  WeaponItem,
  type WeaponAspect,
} from "@builder/sections/weapon-section/components/weapon-item"
import { WeaponGridLoading } from "@/modules/panel/user/builder/sections/weapon-section/ui-states"
import { BuildTextHeader } from "@builder/ui/build-text-header"
import {
  BuildCatalogPicker,
  type BuildCatalogPickerColumns,
} from "@builder/ui/build-catalog-picker"

export type WeaponGridColumns = BuildCatalogPickerColumns

interface WeaponGridProps {
  buildId: string
  onSelect?: () => void
  columns?: WeaponGridColumns
  aspect?: WeaponAspect
  className?: string
}

/**
 * Catalog grid of the weapons the selected resonator can equip.
 *
 * This is the section placeholder: it is suspended only until the catalog list
 * resolves, while the section body waits for the selected weapon detail.
 */
export function WeaponGrid({ columns = 8, ...props }: WeaponGridProps) {
  return (
    <Suspense fallback={<WeaponGridLoading columns={columns} />}>
      <WeaponGridLoaded columns={columns} {...props} />
    </Suspense>
  )
}

function WeaponGridLoaded({
  buildId,
  onSelect,
  columns,
  aspect = "square",
  className,
}: WeaponGridProps) {
  const { items, selectedId } = useCompatibleWeapons(buildId)

  return (
    <div className="space-y-2">
      <BuildTextHeader>Selecciona un arma</BuildTextHeader>

      <BuildCatalogPicker
        items={items}
        getItemKey={(weapon) => weapon.id}
        columns={columns}
        className={className}
        emptyMessage="No hay armas en el catálogo."
      >
        {(weapon) => (
          <WeaponItem
            buildId={buildId}
            weapon={weapon}
            aspect={aspect}
            selected={selectedId === weapon.id}
            onSelect={onSelect}
          />
        )}
      </BuildCatalogPicker>
    </div>
  )
}

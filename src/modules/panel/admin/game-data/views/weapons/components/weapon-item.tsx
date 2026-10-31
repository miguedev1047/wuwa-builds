import { Show } from "@/components/utility/show"
import type { WeaponRow } from "@/db/schema"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"

export function WeaponItem({ weapon }: { weapon: WeaponRow }) {
  return (
    <CatalogSection.Item className="aspect-square rounded-lg bg-muted/40">
      <Show when={weapon.icon}>
        {(image) => (
          <CatalogSection.Image
            animated
            alt={weapon.name}
            className="object-contain p-2"
            src={image}
          />
        )}
      </Show>
    </CatalogSection.Item>
  )
}

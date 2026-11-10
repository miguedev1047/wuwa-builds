import { Show } from "@/components/utility/show"
import type { WeaponRow } from "@db/schema"
import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { Link } from "@tanstack/react-router"

export function WeaponItem({ weapon }: { weapon: WeaponRow }) {
  const weaponId = weapon.id.toString()

  return (
    <Link to="/admin/weapons/$id" params={{ id: weaponId }}>
      <CatalogSection.Item aspect="square" className="rounded-lg bg-muted/40">
        <Show when={weapon.icon}>
          {(image) => (
            <CatalogSection.Image
              animated
              alt={weapon.name}
              className="object-contain"
              src={image}
            />
          )}
        </Show>
      </CatalogSection.Item>
    </Link>
  )
}

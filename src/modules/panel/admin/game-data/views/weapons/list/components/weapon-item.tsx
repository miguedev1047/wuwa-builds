import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Show } from "@/components/utility/show"
import type { WeaponRow } from "@db/schema"
import { CatalogSection } from "@panel/admin/game-data/components/catalog-section"
import { Link } from "@tanstack/react-router"

export function WeaponItem({ weapon }: { weapon: WeaponRow }) {
  const weaponId = weapon.id.toString()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link to="/admin/weapons/$id" params={{ id: weaponId }}>
            <CatalogSection.Item
              aspect="square"
              className="rounded-lg bg-muted/40"
            >
              <Show when={weapon.icon}>
                {(image) => (
                  <CatalogSection.Image
                    alt={weapon.name}
                    src={image}
                    hover="zoom"
                    fit="cover"
                    className="size-full"
                    aspect="portrait"
                    background="accent"
                  />
                )}
              </Show>
            </CatalogSection.Item>
          </Link>
        }
      />
      <TooltipContent>{weapon.name}</TooltipContent>
    </Tooltip>
  )
}

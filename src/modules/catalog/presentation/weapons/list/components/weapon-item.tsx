import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Show } from "@/components/utility/show"
import type { WeaponRow } from "@db/schema"
import { CatalogSection } from "@catalog/presentation/components/catalog-section"
import { useCatalogActions } from "@catalog/presentation/catalog-actions"

export function WeaponItem({ weapon }: { weapon: WeaponRow }) {
  const { DetailLink } = useCatalogActions()

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <DetailLink id={weapon.id}>
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
          </DetailLink>
        }
      />
      <TooltipContent>{weapon.name}</TooltipContent>
    </Tooltip>
  )
}

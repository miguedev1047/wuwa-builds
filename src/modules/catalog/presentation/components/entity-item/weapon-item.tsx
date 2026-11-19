import { EntityItem } from "@catalog/presentation/components/entity-item/entity-item"
import { cn } from "cn"

/** Minimal weapon shape accepted by the item, from D1 or Encore. */
export type WeaponItemData = {
  name: string
  icon: string
}

type WeaponItemProps = {
  weapon: WeaponItemData
  className?: string
}

/** Reusable weapon thumbnail used by catalog lists and searches. */
export function WeaponItem({ weapon, className }: WeaponItemProps) {
  return (
    <EntityItem src={weapon.icon} alt={weapon.name} className={cn(className)} />
  )
}

import { Image } from "@/components/ui/image"
import type { WeaponDetail } from "@/modules/game-data/domain/weapon"

type WeaponPortraitProps = {
  weapon: Pick<WeaponDetail, "name" | "icon">
}

/** Portrait of the selected weapon, full width on narrow screens. */
export function WeaponPortrait({ weapon }: WeaponPortraitProps) {
  return (
    <Image
      src={weapon.icon}
      alt={weapon.name}
      size="xl"
      background="accent"
      aspect="square"
      className="max-sm:w-full"
    />
  )
}

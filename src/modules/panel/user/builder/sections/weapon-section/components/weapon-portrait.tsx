import type { WeaponDetail } from "@game-data/domain/weapon"
import type { BuildProps } from "@/modules/builds/domain/build-record"
import { BuildWorkspace } from "@builder/components/workspace"
import { Image } from "@/components/ui/image"
import { WeaponBaseStats } from "@builder/sections/weapon-section/components/weapon-base-stats"

type WeaponIdentityProps = {
  weapon: WeaponDetail
  build: BuildProps
}

/** Name and change action of the selected weapon. */
export function WeaponPortrait({ weapon, build }: WeaponIdentityProps) {
  return (
    <div className="space-y-2">
      <BuildWorkspace.Text size="sm">{weapon.name}</BuildWorkspace.Text>
      <div className="flex min-h-28 items-stretch gap-2">
        <Image
          src={weapon.icon}
          alt={weapon.name}
          background="accent"
          aspect="square"
          className="h-auto w-28 shrink-0 object-cover"
        />
        <WeaponBaseStats
          properties={weapon.properties}
          level={build.weapon.level}
        />
      </div>
    </div>
  )
}

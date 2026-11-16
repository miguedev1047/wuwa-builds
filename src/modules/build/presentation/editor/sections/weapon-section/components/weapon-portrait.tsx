import type { WeaponDetail } from "@catalog/domain/weapon"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { Image } from "@/components/ui/image"
import { weaponTypeName } from "@catalog/application/weapons/types"
import { GameIcon, gameIconName } from "@/components/ui/game-icon"

type WeaponIdentityProps = {
  weapon: WeaponDetail
}

/** Name and change action of the selected weapon. */
export function WeaponPortrait({ weapon }: WeaponIdentityProps) {
  return (
    <div className="flex items-center gap-4">
      <Image
        src={weapon.icon}
        alt={weapon.name}
        background="accent"
        aspect="square"
        size="md"
      />

      <div className="space-y-1">
        <BuildWorkspace.Text
          size="xl"
          family="bold"
          aria-label={weapon.name}
          title={weapon.name}
        >
          {weapon.name}
        </BuildWorkspace.Text>
        <div className="flex items-center gap-1">
          <GameIcon className="size-4" name={gameIconName(weapon.type)} />
          <p className="text-xs text-muted-foreground">
            {weaponTypeName(weapon.type)}
          </p>
        </div>
      </div>
    </div>
  )
}

import type { WeaponDetail } from "@catalog/domain/weapon"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { Image } from "@/components/ui/image"
import {
  weaponTypeKey,
  weaponTypeNumber,
} from "@/modules/catalog/application/weapons/types"
import { GameIcon, gameIconName } from "@/components/ui/game-icon"

type WeaponIdentityProps = {
  weapon: WeaponDetail
}

/** Name and change action of the selected weapon. */
export function WeaponPortrait({ weapon }: WeaponIdentityProps) {
  const weapoKey = weaponTypeKey(weapon.type)

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
          {weaponTypeNumber(weapon.typeName)}
          <GameIcon className="size-4" name={gameIconName(weapoKey)} />
          <p className="text-xs text-muted-foreground">{weapon.typeName}</p>
        </div>
      </div>
    </div>
  )
}

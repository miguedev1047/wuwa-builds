import * as gameIcons from "@/assets/icons"
import type { BuildStatKey } from "@build/domain/stats"
import { cn } from "cn"

/**
 * Asset used by each canonical builder stat.
 *
 * Percent variants share the icon of their flat base (`hp_percent` → `hp`).
 * `echo_skill_bonus` and `break_impulse` still have no dedicated asset, so they
 * reuse the closest family icon until the catalog adds one.
 */
const STAT_ICON_SOURCES: Record<BuildStatKey, string> = {
  hp: gameIcons.hp,
  hp_percent: gameIcons.hp,
  atk: gameIcons.atk,
  atk_percent: gameIcons.atk,
  def: gameIcons.def,
  def_percent: gameIcons.def,
  crit_rate: gameIcons.crit_rate,
  crit_dmg: gameIcons.crit_dmg,
  energy_regen: gameIcons.energy_regen,
  healing_bonus: gameIcons.healing_bonus,
  basic_atk_bonus: gameIcons.basic_atk_bonus,
  heavy_atk_bonus: gameIcons.heavy_atk_bonus,
  skill_bonus: gameIcons.skill_bonus,
  liberation_bonus: gameIcons.liberation_bonus,
  aero_dmg: gameIcons.aero_dmg,
  glacio_dmg: gameIcons.glacio_dmg,
  electro_dmg: gameIcons.electro_dmg,
  fusion_dmg: gameIcons.fusion_dmg,
  havoc_dmg: gameIcons.havoc_dmg,
  spectro_dmg: gameIcons.spectro_dmg,
  echo_skill_bonus: gameIcons.skill_bonus,
  break_impulse: gameIcons.heavy_atk_bonus,
}

type GameIconName = BuildStatKey | keyof typeof gameIcons

type GameIconProps = Omit<React.ComponentProps<"img">, "src" | "alt"> & {
  /** Canonical stat id, or an asset key such as `lock`. */
  name: GameIconName | null | undefined
  alt?: string
}

function gameIconSource(name: GameIconName | null | undefined) {
  if (!name) return null
  if (name in STAT_ICON_SOURCES) {
    return STAT_ICON_SOURCES[name as BuildStatKey]
  }
  return gameIcons[name as keyof typeof gameIcons] ?? null
}

/** Resolves a stored element, weapon type or stat id to an icon key. */
function gameIconName(value: string | null | undefined): GameIconName | null {
  if (!value) return null
  if (value in gameIcons || value in STAT_ICON_SOURCES) {
    return value as GameIconName
  }
  return null
}

function GameIcon({ name, alt = "", className, ...props }: GameIconProps) {
  const src = gameIconSource(name)
  if (!src) return null

  return (
    <img
      data-slot="stat-icon"
      src={src}
      alt={alt}
      className={cn("size-4 shrink-0 object-contain", className)}
      {...props}
    />
  )
}

export { GameIcon, gameIconName, STAT_ICON_SOURCES }

export type { GameIconName }

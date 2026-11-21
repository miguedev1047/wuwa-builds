import { gameIconSource } from "@/components/ui/game-icon"
import {
  ELEMENT_OPTIONS as elementOptions,
  WEAPON_TYPE_OPTIONS as weaponTypeOptions,
} from "@/modules/game-data/domain/categories"

/** Element options with the icon URLs used by catalog filters. */
export const ELEMENT_OPTIONS = elementOptions.map((option) => ({
  ...option,
  icon: gameIconSource(option.value) ?? undefined,
}))

/** Weapon type options with the icon URLs used by catalog filters. */
export const WEAPON_TYPE_OPTIONS = weaponTypeOptions.map((option) => ({
  ...option,
  icon: gameIconSource(option.value) ?? undefined,
}))

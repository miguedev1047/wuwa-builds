import { parseAsStringEnum } from "nuqs"
import {
  ELEMENT_IDS,
  WEAPON_TYPE_IDS,
  ECHO_CLASS_IDS,
} from "@/modules/game-data/domain/categories"

/** URL filters accept only the current canonical ids. */
export const weaponTypeParser = parseAsStringEnum(WEAPON_TYPE_IDS)
export const echoClassParser = parseAsStringEnum(ECHO_CLASS_IDS)
export const elementParser = parseAsStringEnum(ELEMENT_IDS)

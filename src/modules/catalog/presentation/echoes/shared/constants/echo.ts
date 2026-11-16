import {
  categoryLabel,
  ECHO_CLASSES,
  ECHO_COST_OPTIONS,
} from "@/modules/game-data/domain/categories"
export {
  ECHO_CLASS_OPTIONS,
  ECHO_COST_OPTIONS,
} from "@/modules/game-data/domain/categories"

/** Spanish label of a canonical echo class. */
export function echoClassLabel(value: string): string {
  return categoryLabel(ECHO_CLASSES, value)
}

/** Display label of an echo cost. */
export function echoCostLabel(value: number): string {
  return categoryLabel(ECHO_COST_OPTIONS, value)
}

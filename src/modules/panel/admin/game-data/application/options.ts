/**
 * Option shape every select, combobox and multi-combobox consumes.
 *
 * `label` is panel copy and may change freely; `value` is a stable identifier
 * (a canonical key or a numeric id) that forms submit, the catalog stores and
 * the builder compares. Nothing else belongs here: Encore aliases, scales and
 * other import metadata live in their own maps.
 */
export interface SelectOption<T extends string | number = string> {
  label: string
  value: T
}

/** Panel label of an option value, falling back to the raw value. */
export function optionLabel<T extends string | number>(
  options: readonly SelectOption<T>[],
  value: T | null | undefined
): string {
  if (value === null || value === undefined) return ""

  return String(options.find((option) => option.value === value)?.label ?? value)
}

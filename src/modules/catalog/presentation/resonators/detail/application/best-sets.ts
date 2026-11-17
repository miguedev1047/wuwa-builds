import type { MultiComboboxOption } from "@/components/form/fields/multi-combobox-field"
import type { SonataCatalogEntry } from "@catalog/domain/sonata"

/** Options for Sonata sets stored in the canonical catalog. */
export function bestSetOptions(
  sonatas: readonly SonataCatalogEntry[]
): MultiComboboxOption[] {
  return sonatas.map((sonata) => ({
    label: sonata.name,
    value: String(sonata.id),
    icon: sonata.icon,
  }))
}

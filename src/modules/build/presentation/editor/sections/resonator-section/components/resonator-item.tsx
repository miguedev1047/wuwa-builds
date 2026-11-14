import type { CharacterSummary } from "@catalog/domain/character"
import { useSelectResonator } from "@build/presentation/editor/hooks/use-select-resonator"
import { BuildCatalogPickerItem } from "@build/presentation/components/build-catalog-picker"

export type ResonatorAspect = "square" | "portrait"

interface ResonatorItemProps {
  resonator: CharacterSummary
  buildId: string
  aspect?: ResonatorAspect
  selected?: boolean
  onSelect?: () => void
}

/** Resonator item of the shared catalog picker. */
export function ResonatorItem({
  resonator,
  buildId,
  aspect = "portrait",
  selected = false,
  onSelect,
}: ResonatorItemProps) {
  const { selectResonator } = useSelectResonator(buildId)

  const handleSelect = async () => {
    const applied = await selectResonator(resonator)

    if (applied === "selected" || applied === "unchanged") onSelect?.()
  }

  return (
    <BuildCatalogPickerItem
      label={resonator.name}
      image={resonator.iconLarge}
      aspect={aspect}
      selected={selected}
      onSelect={handleSelect}
    />
  )
}

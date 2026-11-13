import { updateBuild } from "@builds/client/build-store"
import type { CharacterSummary } from "@game-data/domain/character"
import { useSelectResonator } from "@builder/application/use-select-resonator"
import { BuildCatalogPickerItem } from "@builder/ui/build-catalog-picker"

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
  const { selectResonator, preloadResonator } = useSelectResonator(buildId)

  const handleSelect = async () => {
    const applied = await selectResonator(resonator)

    if (applied === "error") return

    if (applied === "selected") {
      preloadResonator(resonator)
      updateBuild(buildId, (current) => {
        current.name = `Build de ${resonator.name}`
      })
    }

    if (applied) onSelect?.()
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

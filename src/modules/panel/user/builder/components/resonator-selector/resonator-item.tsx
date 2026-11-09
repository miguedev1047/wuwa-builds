import { updateBuild } from "@/modules/builds/client/build-store"
import type { CharacterSummary } from "@/modules/game-data/domain/character"
import { useSelectResonator } from "@/modules/panel/user/builder/application/use-select-resonator"
import { BuildCatalogPickerItem } from "../../ui/build-catalog-picker"

export type ResonatorAspect = "square" | "portrait"

interface ResonatorItemProps {
  resonator: CharacterSummary
  buildId: string
  aspect?: ResonatorAspect
  onSelect?: () => void
}

/** Resonator item of the shared catalog picker. */
export function ResonatorItem({
  resonator,
  buildId,
  aspect = "portrait",
  onSelect,
}: ResonatorItemProps) {
  const { selectResonator, preloadResonator } = useSelectResonator(buildId)

  const handleSelect = async () => {
    const result = await selectResonator(resonator)

    if (result === "error") return

    if (result === "selected") {
      preloadResonator(resonator)
      updateBuild(buildId, (current) => {
        current.name = `Build de ${resonator.name}`
      })
    }

    onSelect?.()
  }

  return (
    <BuildCatalogPickerItem
      label={resonator.name}
      image={resonator.iconLarge}
      aspect={aspect}
      onSelect={handleSelect}
    />
  )
}

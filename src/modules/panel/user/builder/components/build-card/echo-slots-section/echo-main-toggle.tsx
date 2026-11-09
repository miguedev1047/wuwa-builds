import { Button } from "@/components/ui/button"
import { updateBuild } from "@/modules/builds/client/build-store"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"

type EchoMainToggleProps = {
  slotIndex: number
}

/** Marks or clears the main echo of the build. */
export function EchoMainToggle({ slotIndex }: EchoMainToggleProps) {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })
  const isMain = build?.mainEchoSlot === slotIndex

  const handleToggle = () => {
    updateBuild(buildId, (draft) => {
      draft.mainEchoSlot = draft.mainEchoSlot === slotIndex ? null : slotIndex
      draft.updateAt = new Date().toISOString()
    })
  }

  return (
    <Button
      type="button"
      variant={isMain ? "secondary" : "outline"}
      size="sm"
      onClick={handleToggle}
    >
      {isMain ? "Quitar eco principal" : "Marcar eco principal"}
    </Button>
  )
}

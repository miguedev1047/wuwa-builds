import { Button } from "@/components/ui/button"
import { updateBuild } from "@builds/client/build-store"

interface EchoSlotMainToggleProps {
  buildId: string
  slotIndex: number
  isMain: boolean
}

/** Marks one equipped echo as the main echo, or clears the selection. */
export function EchoSlotMainToggle({
  buildId,
  slotIndex,
  isMain,
}: EchoSlotMainToggleProps) {
  const handleToggle = () => {
    updateBuild(buildId, (draft) => {
      draft.mainEchoSlot = draft.mainEchoSlot === slotIndex ? null : slotIndex
      draft.updateAt = new Date().toISOString()
    })
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={isMain ? "default" : "outline"}
      onClick={handleToggle}
    >
      {isMain ? "Eco principal" : "Marcar como principal"}
    </Button>
  )
}

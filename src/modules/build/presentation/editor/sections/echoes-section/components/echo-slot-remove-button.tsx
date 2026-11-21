import { Button } from "@/components/panelui/button"
import { Separator } from "@/components/ui/separator"
import { Show } from "@/components/utility/show"
import type { BuildProps } from "@/modules/build/domain/build-record"
import { buildEdits } from "@build/application/build-edits"
import { useBuildStore } from "@build/client/hooks/use-build-store"
import { useBuildIdentity } from "@build/presentation/editor/build-identity"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface EchoSlotRemoveButtonProps {
  build: BuildProps
  slotIndex: number
}

/** Removes the equipped echo from the selected slot. */
export function EchoSlotRemoveButton({
  build,
  slotIndex,
}: EchoSlotRemoveButtonProps) {
  const { buildId, userId } = useBuildIdentity()
  const { update } = useBuildStore(userId)

  return (
    <Show when={build.echoes[slotIndex]?.data}>
      <>
        <Separator />
        <Button
          variant="destructive"
          className="w-full"
          disabled={!build.echoes[slotIndex]?.data}
          onClick={() =>
            update({ buildId, userId }, (draft) =>
              buildEdits.removeEcho(draft, slotIndex)
            )
          }
        >
          <HugeiconsIcon icon={DeleteIcon} />
          Quitar eco
        </Button>
      </>
    </Show>
  )
}

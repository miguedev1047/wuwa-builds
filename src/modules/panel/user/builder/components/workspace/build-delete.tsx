import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { DeleteIcon } from "@hugeicons/core-free-icons"

/** Delete action of the current build. */
export function BuildDelete({ onDelete }: { onDelete: () => void }) {
  return (
    <Button
      onClick={onDelete}
      size="icon"
      variant="destructive"
      aria-label="Eliminar build"
    >
      <HugeiconsIcon icon={DeleteIcon} />
    </Button>
  )
}

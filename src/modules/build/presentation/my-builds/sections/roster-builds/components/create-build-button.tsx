import { Button } from "@/components/panelui/button"
import { Show } from "@/components/utility/show"
import { useIsMobile } from "@/hooks/use-mobile"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface CreateBuildButtonProps {
  isCreating: boolean
  onCreateBuild: () => void
}

export function CreateBuildButton({
  isCreating,
  onCreateBuild,
}: CreateBuildButtonProps) {
  const isMobile = useIsMobile()

  return (
    <Button
      loading={isCreating}
      aria-label={isCreating ? "Creando build" : undefined}
      onClick={onCreateBuild}
      size={isMobile ? "icon" : "md"}
    >
      <HugeiconsIcon icon={PlusIcon} />
      <Show when={!isMobile}>
        <span>Nueva Build</span>
      </Show>
    </Button>
  )
}

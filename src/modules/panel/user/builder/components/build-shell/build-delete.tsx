import { useNavigate } from "@tanstack/react-router"
import { deleteBuild } from "@builds/client/build-store"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { DeleteIcon } from "@hugeicons/core-free-icons"
import { useBuilderId } from "@builder/application/use-builder-id"

export function BuildDelete() {
  const buildId = useBuilderId()
  const navigate = useNavigate()

  const handleDeleteBuild = () => {
    deleteBuild(buildId)
    navigate({ to: "/panel/my-builds" })
  }

  return (
    <Button
      onClick={handleDeleteBuild}
      size="icon"
      variant="destructive"
      aria-label="Eliminar build"
    >
      <HugeiconsIcon icon={DeleteIcon} />
    </Button>
  )
}

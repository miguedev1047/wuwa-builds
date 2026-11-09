import { Button } from "@/components/ui/button"
import { BuildDelete } from "./build-delete"
import { BuildName } from "./build-name"
import { Link } from "@tanstack/react-router"

export function BuildHeader() {
  return (
    <div className="relative z-40 flex items-center justify-between gap-4">
      <Button nativeButton={false} render={<Link to="/panel/my-builds" />}>
        Volver
      </Button>
      <BuildName />
      <BuildDelete />
    </div>
  )
}

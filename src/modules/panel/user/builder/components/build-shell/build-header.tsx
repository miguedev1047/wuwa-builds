import { Button } from "@/components/ui/button"
import { BuildDelete } from "@builder/components/build-shell/build-delete"
import { BuildName } from "@builder/components/build-shell/build-name"
import { BuildResonatorAction } from "@builder/components/build-shell/build-resonator-action"
import { Link } from "@tanstack/react-router"

export function BuildHeader() {
  return (
    <div className="relative z-40 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Button nativeButton={false} render={<Link to="/panel/my-builds" />}>
          Volver
        </Button>
        <div className="md:hidden">
          <BuildResonatorAction />
        </div>
      </div>
      <BuildName />
      <BuildDelete />
    </div>
  )
}

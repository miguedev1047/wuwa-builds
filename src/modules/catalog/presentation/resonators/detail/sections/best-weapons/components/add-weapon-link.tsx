import { Button } from "@/components/panelui/button"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"

export function AddWeaponLink() {
  return (
    <Button nativeButton={false} render={<Link to="/admin/weapons/new" />}>
      <HugeiconsIcon icon={PlusIcon} />
      Nueva arma
    </Button>
  )
}

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { ResonatorList } from "@/modules/panel/admin/game-data/views/resonators/components/resonator-list"

export function ResonatorListPage() {
  return (
    <div className="space-y-4">
      <header className="flex items-center gap-1">
        <Button nativeButton={false} render={<Link to="/admin" />}>
          Volver
        </Button>

        <Button
          variant="secondary"
          nativeButton={false}
          render={<Link to="/admin/resonators" />}
        >
          Nuevo resonador
        </Button>
      </header>

      <Suspense fallback={<Spinner />}>
        <ResonatorList />
      </Suspense>
    </div>
  )
}

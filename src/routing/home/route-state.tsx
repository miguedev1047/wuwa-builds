import { Button } from "@/components/panelui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import { ArrowLeft02Icon, SearchRemoveIcon } from "@hugeicons/core-free-icons"

/** Gives visitors a way back to the landing from an unknown URL. */
export function RouteNotFound() {
  return (
    <div className="grid h-screen place-content-center">
      <Empty className="border border-dashed">
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={SearchRemoveIcon} />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Página no encontrada</EmptyTitle>
          <EmptyDescription>
            Esta página no esta disponible en este momento
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            nativeButton={false}
            render={
              <Link to="/">
                <HugeiconsIcon icon={ArrowLeft02Icon} />
                Volver al inicio
              </Link>
            }
          />
        </EmptyContent>
      </Empty>
    </div>
  )
}

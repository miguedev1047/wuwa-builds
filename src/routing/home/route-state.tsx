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
import { RouteNavigation } from "@/components/blocks/route-navigation"
import { Skeleton } from "@/components/ui/skeleton"
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

export function ProfileNotFound() {
  return (
    <div className="grid min-h-200 place-content-center">
      <Empty className="border border-dashed">
        <EmptyMedia variant="icon">
          <HugeiconsIcon icon={SearchRemoveIcon} />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Perfil no encontrado</EmptyTitle>
          <EmptyDescription>
            Este perfil no esta disponible en este momento
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

/** Reserves the profile header while its data loads. */
export function ProfilePending() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Cargando perfil"
      className="relative z-20"
    >
      <RouteNavigation.Root variant="wide">
        <RouteNavigation.Content>
          <div className="relative h-120 w-full space-y-4" aria-hidden="true">
            <Skeleton className="size-full rounded-md" />
            <Skeleton className="absolute bottom-0 left-8 size-28 translate-y-1/2 rounded-full bg-muted" />
            <div className="ml-40">
              <Skeleton className="h-8 w-48 max-w-full rounded-md" />
            </div>
          </div>
        </RouteNavigation.Content>
      </RouteNavigation.Root>
    </div>
  )
}

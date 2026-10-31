import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ChevronLeftIcon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { EchoList } from "@/modules/panel/admin/game-data/views/echoes/components/echo-list"

export function EchoListPage() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Ecos</CatalogSection.Title>
        <CatalogSection.Description>
          Lista de ecos creados
        </CatalogSection.Description>

        <CatalogSection.Action>
          <Button nativeButton={false} render={<Link to="/admin" />}>
            <HugeiconsIcon icon={ChevronLeftIcon} />
            Volver
          </Button>

          <Button
            variant="secondary"
            nativeButton={false}
            render={<Link to="/admin/echoes" />}
          >
            <HugeiconsIcon icon={PlusIcon} />
            Nuevo eco
          </Button>
        </CatalogSection.Action>
      </CatalogSection.Header>

      <Suspense fallback={<Spinner />}>
        <EchoList />
      </Suspense>
    </CatalogSection.Root>
  )
}

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ChevronLeftIcon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { ResonatorList } from "@/modules/panel/admin/game-data/views/resonators/components/resonator-list"

export function ResonatorListPage() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Resonadores</CatalogSection.Title>
        <CatalogSection.Description>
          Lista de resonadores creados
        </CatalogSection.Description>

        <CatalogSection.Action>
          <Button nativeButton={false} render={<Link to="/admin" />}>
            <HugeiconsIcon icon={ChevronLeftIcon} />
            Volver
          </Button>

          <Button
            variant="secondary"
            nativeButton={false}
            render={<Link to="/admin/resonators" />}
          >
            <HugeiconsIcon icon={PlusIcon} />
            Nuevo resonador
          </Button>
        </CatalogSection.Action>
      </CatalogSection.Header>

      <Suspense fallback={<Spinner />}>
        <ResonatorList />
      </Suspense>
    </CatalogSection.Root>
  )
}

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ChevronLeftIcon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Link } from "@tanstack/react-router"
import { Suspense } from "react"
import { CatalogSection } from "@/modules/panel/admin/game-data/components/catalog-section"
import { WeaponList } from "@/modules/panel/admin/game-data/views/weapons/components/weapon-list"

export function WeaponListPage() {
  return (
    <CatalogSection.Root>
      <CatalogSection.Header>
        <CatalogSection.Title>Armas</CatalogSection.Title>
        <CatalogSection.Description>
          Lista de armas creadas
        </CatalogSection.Description>

        <CatalogSection.Action>
          <Button nativeButton={false} render={<Link to="/admin" />}>
            <HugeiconsIcon icon={ChevronLeftIcon} />
            Volver
          </Button>

          <Button
            variant="secondary"
            nativeButton={false}
            render={<Link to="/admin/weapons" />}
          >
            <HugeiconsIcon icon={PlusIcon} />
            Nueva arma
          </Button>
        </CatalogSection.Action>
      </CatalogSection.Header>

      <Suspense fallback={<Spinner />}>
        <WeaponList />
      </Suspense>
    </CatalogSection.Root>
  )
}

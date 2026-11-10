import { useSuspenseQuery } from "@tanstack/react-query"
import { SkeletonSuspense } from "skullet/react"
import { Button } from "@/components/ui/button"
import type { EncoreWeaponSummary } from "@encore/domain/weapon"
import { encoreWeaponQueries } from "@encore/queries/catalogs"
import { CatalogSearch } from "@panel/admin/game-data/components/catalog-search"

type WeaponSearchProps = {
  /** Id of the weapon already applied to the form, if any. */
  selectedId?: number | null
  onSelect: (weapon: EncoreWeaponSummary) => void
  disabled?: boolean
}

/** Encore weapon picker used to prefill the weapon form. */
export function WeaponSearch({
  selectedId,
  onSelect,
  disabled,
}: WeaponSearchProps) {
  return (
    <CatalogSearch.Root
      trigger={
        <Button
          variant="secondary"
          size="xl"
          type="button"
          className="w-full"
          disabled={disabled}
        >
          Buscar arma
        </Button>
      }
      title="Buscar arma"
      description="Copia los datos de un arma de Encore al formulario."
    >
      <CatalogSearch.Input placeholder="Nombre, tipo o ID del arma" />

      <CatalogSearch.List>
        <SkeletonSuspense skeleton={<CatalogSearch.Loading />}>
          <WeaponSearchResults selectedId={selectedId} onSelect={onSelect} />
        </SkeletonSuspense>
      </CatalogSearch.List>
    </CatalogSearch.Root>
  )
}

type WeaponSearchResultsProps = {
  selectedId?: number | null
  onSelect: (weapon: EncoreWeaponSummary) => void
}

function WeaponSearchResults({
  selectedId,
  onSelect,
}: WeaponSearchResultsProps) {
  const { data: weapons } = useSuspenseQuery(encoreWeaponQueries.list())

  return (
    <>
      <CatalogSearch.Empty>Sin armas con ese nombre.</CatalogSearch.Empty>

      <CatalogSearch.Group heading="Armas">
        {weapons.map((weapon) => (
          <CatalogSearch.Item
            key={weapon.id}
            value={`${weapon.name} ${weapon.id} ${weapon.typeName}`}
            onSelect={() => onSelect(weapon)}
          >
            <img
              src={weapon.icon}
              alt={weapon.name}
              width={28}
              height={28}
              className="aspect-square size-7 shrink-0 rounded-sm bg-accent object-contain"
            />

            <span className="truncate">{weapon.name}</span>

            {selectedId === weapon.id ? (
              <CatalogSearch.Shortcut>Actual</CatalogSearch.Shortcut>
            ) : null}
          </CatalogSearch.Item>
        ))}
      </CatalogSearch.Group>
    </>
  )
}

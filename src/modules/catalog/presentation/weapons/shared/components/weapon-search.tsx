import { Button } from "@/components/panelui/button"
import { CommandSearch } from "@/components/blocks/command-search"
import type { EncoreWeaponSummary } from "@encore/domain/weapon"
import { Suspense } from "react"
import { Show } from "@/components/utility/show"
import { Separator } from "@/components/ui/separator"
import { WeaponSearchFilters } from "@catalog/presentation/weapons/shared/components/search-filters"
import { useWeaponSearchParams } from "@catalog/presentation/weapons/shared/hooks/use-weapon-search-params"
import { useWeaponFiltered } from "@catalog/presentation/weapons/shared/hooks/use-weapon-filtered"

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
  const { clearSearchParams, weaponName, setWeaponName, hasActiveFilter } =
    useWeaponSearchParams()

  return (
    <CommandSearch.Root
      trigger={
        <Button
          variant="secondary"
          size="lg"
          type="button"
          className="w-full"
          disabled={disabled}
        >
          Buscar arma
        </Button>
      }
      search={weaponName ?? ""}
      onSearchChange={(value) => void setWeaponName(value || null)}
      clearSearchParams={clearSearchParams}
      title="Buscar arma"
      description="Copia los datos de un arma de Encore al formulario."
    >
      <CommandSearch.Input placeholder="Nombre, tipo o ID del arma">
        <CommandSearch.FilterTrigger />
      </CommandSearch.Input>
      <CommandSearch.FilterContent
        onClearFilters={clearSearchParams}
        hasActiveFilter={hasActiveFilter}
      >
        <WeaponSearchFilters />
      </CommandSearch.FilterContent>
      <Separator />
      <CommandSearch.List>
        <Suspense fallback={<CommandSearch.Loading />}>
          <WeaponSearchResults selectedId={selectedId} onSelect={onSelect} />
        </Suspense>
      </CommandSearch.List>
    </CommandSearch.Root>
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
  const { filteredWeapons: weapons } = useWeaponFiltered()

  return (
    <>
      <CommandSearch.Empty>Sin armas con ese nombre.</CommandSearch.Empty>
      <Show when={weapons.length > 0}>
        <CommandSearch.Group heading="Armas">
          {weapons.map((weapon) => (
            <CommandSearch.Item
              key={weapon.id}
              value={`${weapon.name} ${weapon.id} ${weapon.typeName}`}
              onSelect={() => onSelect(weapon)}
              subtitle={selectedId === weapon.id ? "Actual" : ""}
              icon={
                <img
                  src={weapon.icon}
                  alt={weapon.name}
                  className="shrink-0 rounded-sm bg-input/50 object-contain"
                />
              }
            >
              {weapon.name}
            </CommandSearch.Item>
          ))}
        </CommandSearch.Group>
      </Show>
    </>
  )
}

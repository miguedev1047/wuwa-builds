import { Button } from "@/components/panelui/button"
import { CommandSearch } from "@/components/blocks/command-search"
import type { EncoreCharacterSummary } from "@encore/domain/character"
import { Suspense } from "react"
import { useResonatorSearchParams } from "../hooks/use-resonator-search-params"
import { ResonatorSearchFilters } from "./search-filters"
import { Separator } from "@/components/ui/separator"
import { useResonatorsFiltered } from "../hooks/use-resonator-filtered"
import { Show } from "@/components/utility/show"

type ResonatorSearchProps = {
  /** Id of the character already applied to the form, if any. */
  selectedId?: number | null
  onSelect: (character: EncoreCharacterSummary) => void
  disabled?: boolean
}

/** Encore character picker used to prefill the resonator form. */
export function ResonatorSearch({
  selectedId,
  onSelect,
  disabled,
}: ResonatorSearchProps) {
  const {
    clearSearchParams,
    hasActiveFilter,
    resonatorName,
    setResonatorName,
  } = useResonatorSearchParams()

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
          Buscar resonador
        </Button>
      }
      search={resonatorName ?? ""}
      onSearchChange={(value) => setResonatorName(value || null)}
      clearSearchParams={clearSearchParams}
      title="Buscar resonador"
      description="Copia los datos de un resonador de Encore al formulario."
    >
      <CommandSearch.Input placeholder="Nombre o ID del resonador">
        <CommandSearch.FilterTrigger />
      </CommandSearch.Input>
      <CommandSearch.FilterContent
        hasActiveFilter={hasActiveFilter}
        onClearFilters={clearSearchParams}
      >
        <ResonatorSearchFilters />
      </CommandSearch.FilterContent>
      <Separator />
      <CommandSearch.List>
        <Suspense fallback={<CommandSearch.Loading />}>
          <ResonatorSearchResults selectedId={selectedId} onSelect={onSelect} />
        </Suspense>
      </CommandSearch.List>
    </CommandSearch.Root>
  )
}

type ResonatorSearchResultsProps = {
  selectedId?: number | null
  onSelect: (character: EncoreCharacterSummary) => void
}

function ResonatorSearchResults({
  selectedId,
  onSelect,
}: ResonatorSearchResultsProps) {
  const { filteredResonators: characters } = useResonatorsFiltered()

  return (
    <>
      <CommandSearch.Empty>Sin resonadores con ese nombre.</CommandSearch.Empty>
      <CommandSearch.Group heading="Resonadores">
        <Show when={characters.length > 0}>
          {characters.map((character) => (
            <CommandSearch.Item
              key={character.id}
              value={`${character.name} ${character.id}`}
              onSelect={() => onSelect(character)}
              subtitle={selectedId === character.id ? "Actual" : ""}
              icon={
                <img
                  src={character.icon}
                  alt={character.name}
                  className="shrink-0 rounded-sm bg-input/50 object-contain"
                />
              }
            >
              {character.name}
            </CommandSearch.Item>
          ))}
        </Show>
      </CommandSearch.Group>
    </>
  )
}

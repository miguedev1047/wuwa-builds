import { Suspense } from "react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { EncoreCharacterSummary } from "@/modules/encore/domain/character"
import { characterQueries } from "@/modules/encore/queries/characters"
import { CatalogSearch } from "@/modules/panel/admin/game-data/components/catalog-search"

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
          Buscar resonador
        </Button>
      }
      title="Buscar resonador"
      description="Copia los datos de un resonador de Encore al formulario."
    >
      <CatalogSearch.Input placeholder="Nombre o ID del resonador" />
      <CatalogSearch.Empty>Sin resonadores con ese nombre.</CatalogSearch.Empty>

      <Suspense fallback={<CatalogSearch.Loading />}>
        <CatalogSearch.List>
          <ResonatorSearchResults selectedId={selectedId} onSelect={onSelect} />
        </CatalogSearch.List>
      </Suspense>
    </CatalogSearch.Root>
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
  const { data: characters } = useSuspenseQuery(characterQueries.list())

  return (
    <CatalogSearch.Group heading="Resonadores">
      {characters.map((character) => (
        <CatalogSearch.Item
          key={character.id}
          value={`${character.name} ${character.id}`}
          onSelect={() => onSelect(character)}
        >
          <img
            src={character.icon}
            alt=""
            className="size-7 shrink-0 rounded-sm bg-accent object-cover"
          />
          <span className="truncate">{character.name}</span>
          <Badge variant="secondary">{character.weaponType}</Badge>
          {selectedId === character.id ? (
            <CatalogSearch.Shortcut>Actual</CatalogSearch.Shortcut>
          ) : null}
        </CatalogSearch.Item>
      ))}
    </CatalogSearch.Group>
  )
}
